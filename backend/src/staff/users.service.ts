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

  // User Roles methods
  async getCurrentUserRoles(userId: string) {
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      select: {
        role: true,
        assignedAt: true,
        assignedBy: true,
      },
    });

    return userRoles.map(ur => ({
      role: ur.role,
      assignedAt: ur.assignedAt,
      assignedBy: ur.assignedBy,
    }));
  }

  async assignRole(userId: string, role: string, assignedBy: string) {
    // Check if role already exists and is active
    const existingRole = await this.prisma.userRole.findFirst({
      where: {
        userId: userId,
        role: role,
        isActive: true,
      },
    });

    if (existingRole) {
      throw new BadRequestException('User already has this role');
    }

    // Create new role assignment
    const userRole = await this.prisma.userRole.create({
      data: {
        userId: userId,
        role: role,
        assignedBy: assignedBy,
        isActive: true,
      },
    });

    return userRole;
  }

  async removeRole(userId: string, role: string) {
    const userRole = await this.prisma.userRole.findFirst({
      where: {
        userId: userId,
        role: role,
        isActive: true,
      },
    });

    if (!userRole) {
      throw new NotFoundException('Role not found for user');
    }

    // Soft delete by setting isActive to false
    return this.prisma.userRole.update({
      where: { id: userRole.id },
      data: { isActive: false },
    });
  }

  // Performance Metrics methods
  async getPerformanceMetrics(userId?: string) {
    const whereClause = userId ? { userId: userId } : {};

    const metrics = await this.prisma.performanceMetric.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        reviewer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        periodStart: 'desc',
      },
    });

    return metrics.map(metric => ({
      id: metric.id,
      user_id: metric.userId,
      metric_type: metric.metricType,
      metric_value: metric.metricValue,
      target_value: metric.targetValue,
      measurement_period: metric.measurementPeriod,
      period_start: metric.periodStart,
      period_end: metric.periodEnd,
      notes: metric.notes,
      reviewed_by: metric.reviewedBy,
      reviewed_at: metric.reviewedAt,
      created_at: metric.createdAt,
      user: metric.user,
      reviewer: metric.reviewer,
    }));
  }

  async createPerformanceMetric(metricData: any, createdBy: string) {
    const metric = await this.prisma.performanceMetric.create({
      data: {
        userId: metricData.userId || createdBy,
        metricType: metricData.metric_type,
        metricValue: metricData.metric_value,
        targetValue: metricData.target_value,
        measurementPeriod: metricData.measurement_period,
        periodStart: new Date(metricData.period_start),
        periodEnd: new Date(metricData.period_end),
        notes: metricData.notes,
        reviewedBy: metricData.reviewed_by,
        reviewedAt: metricData.reviewed_at ? new Date(metricData.reviewed_at) : null,
      },
    });

    return metric;
  }

  async updatePerformanceMetric(id: string, updates: any) {
    const updateData: any = {};

    if (updates.metric_type) updateData.metricType = updates.metric_type;
    if (updates.metric_value !== undefined) updateData.metricValue = updates.metric_value;
    if (updates.target_value !== undefined) updateData.targetValue = updates.target_value;
    if (updates.measurement_period) updateData.measurementPeriod = updates.measurement_period;
    if (updates.period_start) updateData.periodStart = new Date(updates.period_start);
    if (updates.period_end) updateData.periodEnd = new Date(updates.period_end);
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.reviewed_by) updateData.reviewedBy = updates.reviewed_by;
    if (updates.reviewed_at) updateData.reviewedAt = new Date(updates.reviewed_at);

    const metric = await this.prisma.performanceMetric.update({
      where: { id },
      data: updateData,
    });

    return metric;
  }
} 