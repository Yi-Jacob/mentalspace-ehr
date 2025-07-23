import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Helper function to safely parse dates
  private parseDate(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    } catch (error) {
      throw new BadRequestException(`Invalid date format: ${dateString}`);
    }
  }

  async create(createUserDto: CreateUserDto) {
    console.log('Creating staff member with data:', createUserDto);

    try {
      // Use Prisma transaction to ensure data consistency
      const result = await this.prisma.$transaction(async (prisma) => {
        // 1. Create the user record
        const user = await prisma.user.create({
          data: {
            email: createUserDto.email,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            isActive: true,
          },
        });

        // 2. Create the staff profile
        const staffProfile = await prisma.staffProfile.create({
          data: {
            userId: user.id,
            employeeId: createUserDto.employeeId,
            npiNumber: createUserDto.npiNumber,
            licenseNumber: createUserDto.licenseNumber,
            licenseState: createUserDto.licenseState,
            licenseExpiryDate: this.parseDate(createUserDto.licenseExpiryDate) || new Date(),
            department: createUserDto.department,
            jobTitle: createUserDto.jobTitle,
            hireDate: this.parseDate(createUserDto.hireDate) || new Date(),
            phoneNumber: createUserDto.phoneNumber,
            billingRate: createUserDto.billingRate,
            canBillInsurance: createUserDto.canBillInsurance || false,
            status: createUserDto.status || 'active',
            notes: createUserDto.notes,
          },
        });

        // 3. Assign roles if provided
        if (createUserDto.roles && createUserDto.roles.length > 0) {
          const roleData = createUserDto.roles.map(role => ({
            userId: user.id,
            role: role,
            isActive: true,
          }));

          await prisma.userRole.createMany({
            data: roleData,
          });
        }

        // 4. Create supervision relationship if supervisor is specified and supervision type is not 'Not Supervised'
        if (createUserDto.supervisionType && 
            createUserDto.supervisionType !== 'Not Supervised' && 
            createUserDto.supervisorId) {
          await prisma.supervisionRelationship.create({
            data: {
              supervisorId: createUserDto.supervisorId,
              superviseeId: user.id,
              supervisionType: createUserDto.supervisionType,
              startDate: new Date(),
              isActive: true,
            },
          });
        }

        return {
          user,
          staffProfile,
          message: 'Staff member created successfully',
        };
      });

      return result;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  }

  async findAll() {
    console.log('findAll - fetching all staff members');
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });
    
    // Get related data separately since relationships aren't defined
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const [staffProfile, userRoles] = await Promise.all([
          this.prisma.staffProfile.findFirst({ where: { userId: user.id } }),
          this.prisma.userRole.findMany({ where: { userId: user.id, isActive: true } }),
        ]);
        
        // Transform data to use camelCase
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          staffProfile: staffProfile ? {
            id: staffProfile.id,
            userId: staffProfile.userId,
            employeeId: staffProfile.employeeId,
            npiNumber: staffProfile.npiNumber,
            licenseNumber: staffProfile.licenseNumber,
            licenseState: staffProfile.licenseState,
            licenseExpiryDate: staffProfile.licenseExpiryDate,
            department: staffProfile.department,
            jobTitle: staffProfile.jobTitle,
            hireDate: staffProfile.hireDate,
            phoneNumber: staffProfile.phoneNumber,
            billingRate: staffProfile.billingRate,
            canBillInsurance: staffProfile.canBillInsurance,
            status: staffProfile.status,
            notes: staffProfile.notes,
            createdAt: staffProfile.createdAt,
            updatedAt: staffProfile.updatedAt,
          } : null,
          roles: userRoles.map(role => ({
            id: role.id,
            userId: role.userId,
            role: role.role,
            isActive: role.isActive,
            assignedAt: role.assignedAt,
          })),
        };
      })
    );
    
    console.log(`Found ${usersWithDetails.length} staff members`);
    return usersWithDetails;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Get related data separately
    const [staffProfile, userRoles] = await Promise.all([
      this.prisma.staffProfile.findFirst({ where: { userId: user.id } }),
      this.prisma.userRole.findMany({ where: { userId: user.id, isActive: true } }),
    ]);

    // Transform data to use camelCase
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      staffProfile: staffProfile ? {
        id: staffProfile.id,
        userId: staffProfile.userId,
        employeeId: staffProfile.employeeId,
        npiNumber: staffProfile.npiNumber,
        licenseNumber: staffProfile.licenseNumber,
        licenseState: staffProfile.licenseState,
        licenseExpiryDate: staffProfile.licenseExpiryDate,
        department: staffProfile.department,
        jobTitle: staffProfile.jobTitle,
        hireDate: staffProfile.hireDate,
        phoneNumber: staffProfile.phoneNumber,
        billingRate: staffProfile.billingRate,
        canBillInsurance: staffProfile.canBillInsurance,
        status: staffProfile.status,
        notes: staffProfile.notes,
        createdAt: staffProfile.createdAt,
        updatedAt: staffProfile.updatedAt,
      } : null,
      roles: userRoles.map(role => ({
        id: role.id,
        userId: role.userId,
        role: role.role,
        isActive: role.isActive,
        assignedAt: role.assignedAt,
      })),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check if user exists

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if user exists

    return this.prisma.user.delete({
      where: { id },
    });
  }
} 