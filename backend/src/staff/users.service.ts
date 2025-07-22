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
        
        // Transform data to match frontend expectations
        return {
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          is_active: user.isActive,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          staff_profile: staffProfile ? {
            id: staffProfile.id,
            user_id: staffProfile.userId,
            employee_id: staffProfile.employeeId,
            npi_number: staffProfile.npiNumber,
            license_number: staffProfile.licenseNumber,
            license_state: staffProfile.licenseState,
            license_expiry_date: staffProfile.licenseExpiryDate,
            department: staffProfile.department,
            job_title: staffProfile.jobTitle,
            hire_date: staffProfile.hireDate,
            phone_number: staffProfile.phoneNumber,
            billing_rate: staffProfile.billingRate,
            can_bill_insurance: staffProfile.canBillInsurance,
            status: staffProfile.status,
            notes: staffProfile.notes,
            created_at: staffProfile.createdAt,
            updated_at: staffProfile.updatedAt,
          } : null,
          roles: userRoles.map(role => ({
            id: role.id,
            user_id: role.userId,
            role: role.role,
            is_active: role.isActive,
            assigned_at: role.assignedAt,
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

    // Transform data to match frontend expectations
    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      staff_profile: staffProfile ? {
        id: staffProfile.id,
        user_id: staffProfile.userId,
        employee_id: staffProfile.employeeId,
        npi_number: staffProfile.npiNumber,
        license_number: staffProfile.licenseNumber,
        license_state: staffProfile.licenseState,
        license_expiry_date: staffProfile.licenseExpiryDate,
        department: staffProfile.department,
        job_title: staffProfile.jobTitle,
        hire_date: staffProfile.hireDate,
        phone_number: staffProfile.phoneNumber,
        billing_rate: staffProfile.billingRate,
        can_bill_insurance: staffProfile.canBillInsurance,
        status: staffProfile.status,
        notes: staffProfile.notes,
        created_at: staffProfile.createdAt,
        updated_at: staffProfile.updatedAt,
      } : null,
      roles: userRoles.map(role => ({
        id: role.id,
        user_id: role.userId,
        role: role.role,
        is_active: role.isActive,
        assigned_at: role.assignedAt,
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