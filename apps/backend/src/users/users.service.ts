import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
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

  async findAll() {
    const users = await this.prisma.user.findMany();
    
    // Get related data separately since relationships aren't defined
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        // Transform data to use camelCase
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          suffix: user.suffix,
          email: user.email,
          userName: user.userName,
          clientId: user.clientId,
          staffId: user.staffId,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
      })
    );
    
    return usersWithDetails;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        staffProfile: true,
        client: true,
        userRoles: {
          where: { isActive: true }
        },
        licenses: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

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
      // Determine user type from which ID is populated
      userType: user.staffId ? 'staff' : user.clientId ? 'client' : 'unknown',
      roles: user.userRoles.map(role => role.role),
      // Staff profile fields (if user is staff)
      ...(user.staffProfile && {
        employeeId: user.staffProfile.employeeId,
        npiNumber: user.staffProfile.npiNumber,
        licenseNumber: user.staffProfile.licenseNumber,
        licenseState: user.staffProfile.licenseState,
        licenseExpiryDate: user.staffProfile.licenseExpiryDate,
        department: user.staffProfile.department,
        jobTitle: user.staffProfile.jobTitle,
        hireDate: user.staffProfile.hireDate,
        phoneNumber: user.staffProfile.phoneNumber,
        billingRate: user.staffProfile.billingRate,
        canBillInsurance: user.staffProfile.canBillInsurance,
        status: user.staffProfile.status,
        notes: user.staffProfile.notes,
        userComments: user.staffProfile.userComments,
        mobilePhone: user.staffProfile.mobilePhone,
        workPhone: user.staffProfile.workPhone,
        homePhone: user.staffProfile.homePhone,
        canReceiveText: user.staffProfile.canReceiveText,
        address1: user.staffProfile.address1,
        address2: user.staffProfile.address2,
        city: user.staffProfile.city,
        state: user.staffProfile.state,
        zipCode: user.staffProfile.zipCode,
        formalName: user.staffProfile.formalName,
        clinicianType: user.staffProfile.clinicianType,
        supervisionType: user.staffProfile.supervisionType,
      }),
      // Client fields (if user is client)
      ...(user.client && {
        clientId: user.client.id,
        dateOfBirth: user.client.dateOfBirth,
        preferredName: user.client.preferredName,
        pronouns: user.client.pronouns,
        administrativeSex: user.client.administrativeSex,
        genderIdentity: user.client.genderIdentity,
        sexualOrientation: user.client.sexualOrientation,
        address1: user.client.address1,
        address2: user.client.address2,
        timezone: user.client.timezone,
        race: user.client.race,
        ethnicity: user.client.ethnicity,
        languages: user.client.languages,
        maritalStatus: user.client.maritalStatus,
        employmentStatus: user.client.employmentStatus,
        religiousAffiliation: user.client.religiousAffiliation,
        smokingStatus: user.client.smokingStatus,
        appointmentReminders: user.client.appointmentReminders,
        hipaaSigned: user.client.hipaaSigned,
        pcpRelease: user.client.pcpRelease,
        patientComments: user.client.patientComments,
        assignedClinicianId: user.client.assignedClinicianId,
      }),
      licenses: user.licenses.map(license => ({
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


  // Helper method to get client by user ID
  async getClientByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { clientId: true },
    });

    if (!user?.clientId) {
      return null;
    }

    return this.prisma.client.findUnique({
      where: { id: user.clientId },
      select: { id: true },
    });
  }

  // Helper method to get staff profile by user ID
  async getStaffProfileByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { staffId: true },
    });

    if (!user?.staffId) {
      return null;
    }

    return this.prisma.staffProfile.findUnique({
      where: { id: user.staffId },
      select: { id: true },
    });
  }

  // Helper method to get supervisee IDs for a supervisor
  async getSuperviseeIds(supervisorId: string): Promise<string[]> {
    const supervisionRelationships = await this.prisma.supervisionRelationship.findMany({
      where: {
        supervisorId,
        status: 'active',
      },
      select: { superviseeId: true },
    });

    return supervisionRelationships.map(rel => rel.superviseeId);
  }
} 