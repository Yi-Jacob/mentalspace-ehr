import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // Helper function to safely parse dates
  private parseDate(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined;
    
    try {
      // Handle YYYY-MM-DD format (from frontend DateInput)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month is 0-indexed
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        return date;
      }
      
      // Handle full ISO 8601 format
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    } catch (error) {
      throw new BadRequestException(`Invalid date format: ${dateString}. Expected YYYY-MM-DD or ISO 8601 format.`);
    }
  }

  async create(createUserDto: CreateUserDto) {
    console.log('Creating staff member with data:', createUserDto);

    try {
      // Use Prisma transaction to ensure data consistency
      const result = await this.prisma.$transaction(async (prisma) => {
        // 1. Create the user record without a password
        const user = await prisma.user.create({
          data: {
            email: createUserDto.email,
            password: null, // No password set initially
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            middleName: createUserDto.middleName,
            suffix: createUserDto.suffix,
            userName: createUserDto.userName,
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
            
            // Additional fields for frontend forms
            userComments: createUserDto.userComments,
            mobilePhone: createUserDto.mobilePhone,
            workPhone: createUserDto.workPhone,
            homePhone: createUserDto.homePhone,
            canReceiveText: createUserDto.canReceiveText,
            address1: createUserDto.address1,
            address2: createUserDto.address2,
            city: createUserDto.city,
            state: createUserDto.state,
            zipCode: createUserDto.zipCode,
            formalName: createUserDto.formalName,
            clinicianType: createUserDto.clinicianType,
          },
        });



        // 3. Create user roles if specified
        if (createUserDto.roles && createUserDto.roles.length > 0) {
          const roleRecords = createUserDto.roles.map(role => ({
            userId: user.id,
            role: role,
            assignedAt: new Date(),
            isActive: true,
          }));
          
          await prisma.userRole.createMany({
            data: roleRecords,
          });
        }

        // 4. Create licenses if specified
        if (createUserDto.licenses && createUserDto.licenses.length > 0) {
          // Filter out licenses where all fields are empty
          const validLicenses = createUserDto.licenses.filter(license => 
            license.licenseType || 
            license.licenseNumber || 
            license.licenseState || 
            license.licenseExpirationDate || 
            license.issuedBy
          );

          if (validLicenses.length > 0) {
            const licenseRecords = validLicenses.map(license => ({
              staffId: user.id,
              licenseType: license.licenseType || '',
              licenseNumber: license.licenseNumber || '',
              licenseExpirationDate: this.parseDate(license.licenseExpirationDate) || new Date(),
              licenseStatus: license.licenseStatus || 'active',
              licenseState: license.licenseState || '',
              issuedBy: license.issuedBy || '',
            }));
            console.log('licenseRecords', licenseRecords);
            await prisma.license.createMany({
              data: licenseRecords,
            });
          }
        }

        // 5. Generate password reset token for the new user
        const passwordResetData = await this.authService.createPasswordResetToken(user.id);

        return {
          user,
          staffProfile,
          passwordResetUrl: passwordResetData.resetUrl,
          message: 'Staff member created successfully. Password reset link has been generated.',
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
    const users = await this.prisma.user.findMany();
    
    // Get related data separately since relationships aren't defined
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        // Get user roles
        const userRoles = await this.prisma.userRole.findMany({
          where: { userId: user.id, isActive: true },
        });

        // Transform data to use camelCase
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          suffix: user.suffix,
          email: user.email,
          userName: user.userName,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          roles: userRoles.map(role => role.role)
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
    const staffProfile = await this.prisma.staffProfile.findFirst({ 
      where: { userId: user.id } 
    });

    // Get user roles
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id, isActive: true },
    });

    // Get licenses
    const licenses = await this.prisma.license.findMany({
      where: { staffId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    console.log('licenses', licenses);
    // Transform data to use camelCase
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      suffix: user.suffix,
      email: user.email,
      userName: user.userName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: userRoles.map(role => role.role),
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
      userComments: staffProfile.userComments,
      mobilePhone: staffProfile.mobilePhone,
      workPhone: staffProfile.workPhone,
      homePhone: staffProfile.homePhone,
      canReceiveText: staffProfile.canReceiveText,
      address1: staffProfile.address1,
      address2: staffProfile.address2,
      city: staffProfile.city,
      state: staffProfile.state,
      zipCode: staffProfile.zipCode,
      formalName: staffProfile.formalName,
      clinicianType: staffProfile.clinicianType,
      supervisionType: staffProfile.supervisionType,
      licenses: licenses.map(license => ({
        id: license.id,
        staffId: license.staffId,
        licenseType: license.licenseType,
        licenseNumber: license.licenseNumber,
        licenseExpirationDate: license.licenseExpirationDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        licenseStatus: license.licenseStatus,
        licenseState: license.licenseState,
        issuedBy: license.issuedBy,
        createdAt: license.createdAt.toISOString(),
        updatedAt: license.updatedAt.toISOString(),
      })),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check if user exists

    // Separate user fields from staff profile fields
    const userFields = {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      middleName: updateUserDto.middleName,
      suffix: updateUserDto.suffix,
      email: updateUserDto.email,
      userName: updateUserDto.userName,
    };

    const staffProfileFields = {
      employeeId: updateUserDto.employeeId,
      npiNumber: updateUserDto.npiNumber,
      licenseNumber: updateUserDto.licenseNumber,
      licenseState: updateUserDto.licenseState,
      licenseExpiryDate: this.parseDate(updateUserDto.licenseExpiryDate),
      department: updateUserDto.department,
      jobTitle: updateUserDto.jobTitle,
      hireDate: this.parseDate(updateUserDto.hireDate),
      phoneNumber: updateUserDto.phoneNumber,
      billingRate: updateUserDto.billingRate,
      canBillInsurance: updateUserDto.canBillInsurance,
      status: updateUserDto.status,
      notes: updateUserDto.notes,
      
      // Additional fields for frontend forms
      userComments: updateUserDto.userComments,
      mobilePhone: updateUserDto.mobilePhone,
      workPhone: updateUserDto.workPhone,
      homePhone: updateUserDto.homePhone,
      canReceiveText: updateUserDto.canReceiveText,
      address1: updateUserDto.address1,
      address2: updateUserDto.address2,
      city: updateUserDto.city,
      state: updateUserDto.state,
      zipCode: updateUserDto.zipCode,
      formalName: updateUserDto.formalName,
      clinicianType: updateUserDto.clinicianType,
    };

    // Remove undefined values
    const cleanUserFields = Object.fromEntries(
      Object.entries(userFields).filter(([_, value]) => value !== undefined)
    );

    const cleanStaffProfileFields = Object.fromEntries(
      Object.entries(staffProfileFields).filter(([_, value]) => value !== undefined)
    );

    // Use Prisma transaction to ensure data consistency
    const result = await this.prisma.$transaction(async (prisma) => {
      // Update user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: cleanUserFields,
      });

      // Update or create staff profile
      const existingStaffProfile = await prisma.staffProfile.findFirst({
        where: { userId: id },
      });

      let updatedStaffProfile;
      if (existingStaffProfile) {
        updatedStaffProfile = await prisma.staffProfile.update({
          where: { id: existingStaffProfile.id },
          data: cleanStaffProfileFields,
        });
      } else {
        updatedStaffProfile = await prisma.staffProfile.create({
          data: {
            userId: id,
            ...cleanStaffProfileFields,
          },
        });
      }

      // Update roles if provided
      if (updateUserDto.roles) {
        // Remove existing roles
        await prisma.userRole.deleteMany({
          where: { userId: id },
        });

        // Add new roles
        if (updateUserDto.roles.length > 0) {
          const roleRecords = updateUserDto.roles.map(role => ({
            userId: id,
            role: role,
            assignedAt: new Date(),
            isActive: true,
          }));
          
          await prisma.userRole.createMany({
            data: roleRecords,
          });
        }
      }

      // Update licenses if provided
      if (updateUserDto.licenses) {
        // Remove existing licenses
        await prisma.license.deleteMany({
          where: { staffId: id },
        });

        // Add new licenses if any are provided
        if (updateUserDto.licenses.length > 0) {
          // Filter out licenses where all fields are empty
          const validLicenses = updateUserDto.licenses.filter(license => 
            license.licenseType || 
             license.licenseNumber || 
             license.licenseState || 
             license.licenseExpirationDate || 
            license.issuedBy
          );

          if (validLicenses.length > 0) {
            const licenseRecords = validLicenses.map(license => ({
              staffId: id,
              licenseType: license.licenseType || '',
              licenseNumber: license.licenseNumber || '',
              licenseExpirationDate: this.parseDate(license.licenseExpirationDate) || new Date(),
              licenseStatus: license.licenseStatus || 'active',
              licenseState: license.licenseState || '',
              issuedBy: license.issuedBy || '',
            }));
            
            await prisma.license.createMany({
              data: licenseRecords,
            });
          }
        }
      }

      return { updatedUser, updatedStaffProfile };
    });

    // Return updated user with profile
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id); // Check if user exists

    return this.prisma.user.delete({
      where: { id },
    });
  }

  // Performance Metrics methods
  async getPerformanceMetrics(userId?: string) {
    const whereClause = userId ? { userId: userId } : {};

    const metrics = await this.prisma.performanceMetric.findMany({
      where: whereClause,
      orderBy: {
        periodStart: 'desc',
      },
    });

    return metrics.map(metric => ({
      id: metric.id,
      userId: metric.userId,
      metricType: metric.metricType,
      metricValue: metric.metricValue,
      targetValue: metric.targetValue,
      measurementPeriod: metric.measurementPeriod,
      periodStart: metric.periodStart,
      periodEnd: metric.periodEnd,
      notes: metric.notes,
      reviewedBy: metric.reviewedBy,
      reviewedAt: metric.reviewedAt,
      createdAt: metric.createdAt,
    }));
  }

  async createPerformanceMetric(metricData: any, createdBy: string) {
    const metric = await this.prisma.performanceMetric.create({
      data: {
        userId: metricData.userId || createdBy,
        metricType: metricData.metricType,
        metricValue: metricData.metricValue,
        targetValue: metricData.targetValue,
        measurementPeriod: metricData.measurementPeriod,
        periodStart: new Date(metricData.periodStart),
        periodEnd: new Date(metricData.periodEnd),
        notes: metricData.notes,
        reviewedBy: metricData.reviewedBy,
        reviewedAt: metricData.reviewedAt ? new Date(metricData.reviewedAt) : null,
      },
    });

    return metric;
  }

  async updatePerformanceMetric(id: string, updates: any) {
    const updateData: any = {};

    if (updates.metricType) updateData.metricType = updates.metricType;
    if (updates.metricValue !== undefined) updateData.metricValue = updates.metricValue;
    if (updates.targetValue !== undefined) updateData.targetValue = updates.targetValue;
    if (updates.measurementPeriod) updateData.measurementPeriod = updates.measurementPeriod;
    if (updates.periodStart) updateData.periodStart = new Date(updates.periodStart);
    if (updates.periodEnd) updateData.periodEnd = new Date(updates.periodEnd);
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.reviewedBy) updateData.reviewedBy = updates.reviewedBy;
    if (updates.reviewedAt) updateData.reviewedAt = new Date(updates.reviewedAt);

    const metric = await this.prisma.performanceMetric.update({
      where: { id },
      data: updateData,
    });

    return metric;
  }

  // Set default password for a user
  async setDefaultPassword(userId: string) {
    const user = await this.findOne(userId);
    
    const defaultPassword = this.configService.get<string>('DEFAULT_USER_PASSWORD', 'ChangeMe123!');
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: 'Default password set successfully',
      userId: updatedUser.id,
      email: updatedUser.email,
      defaultPassword: defaultPassword // Only return in development
    };
  }

  // Activate a user
  async activateUser(userId: string) {
    const user = await this.findOne(userId);
    
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    return {
      message: 'User activated successfully',
      userId: updatedUser.id,
      email: updatedUser.email,
      isActive: updatedUser.isActive
    };
  }

  // Deactivate a user
  async deactivateUser(userId: string) {
    const user = await this.findOne(userId);
    
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return {
      message: 'User deactivated successfully',
      userId: updatedUser.id,
      email: updatedUser.email,
      isActive: updatedUser.isActive
    };
  }
} 