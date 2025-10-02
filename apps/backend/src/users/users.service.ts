import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { BCRYPT_SALT_ROUNDS } from '../common/constants';

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

  // Get current user's profile with relationships
  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        staffProfile: {
          include: {
            clients: {
              include: {
                client: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    preferredName: true,
                    email: true,
                  }
                }
              }
            }
          }
        },
        client: {
          include: {
            clinicians: {
              include: {
                clinician: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                      }
                    }
                  }
                }
              }
            }
          }
        },
        userRoles: {
          where: { isActive: true }
        },
        licenses: true,
        supervisionAsSupervisor: {
          where: { status: 'active' },
          include: {
            supervisee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                staffProfile: {
                  select: {
                    jobTitle: true,
                    department: true,
                  }
                }
              }
            }
          }
        },
        supervisionAsSupervisee: {
          where: { status: 'active' },
          include: {
            supervisor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                staffProfile: {
                  select: {
                    jobTitle: true,
                    department: true,
                  }
                }
              }
            }
          }
        },
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Transform data to use camelCase
    const profile = {
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
        // Assigned clients
        assignedClients: user.staffProfile.clients.map(rel => ({
          id: rel.client.id,
          firstName: rel.client.firstName,
          lastName: rel.client.lastName,
          preferredName: rel.client.preferredName,
          email: rel.client.email,
        })),
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
        // Assigned staff/clinicians
        assignedClinicians: user.client.clinicians.map(rel => ({
          id: rel.clinician.id,
          firstName: rel.clinician.user.firstName,
          lastName: rel.clinician.user.lastName,
          email: rel.clinician.user.email,
          jobTitle: rel.clinician.jobTitle,
          department: rel.clinician.department,
        })),
      }),
      
      // Supervision relationships
      supervisors: user.supervisionAsSupervisee.map(rel => ({
        id: rel.supervisor.id,
        firstName: rel.supervisor.firstName,
        lastName: rel.supervisor.lastName,
        email: rel.supervisor.email,
        jobTitle: rel.supervisor.staffProfile?.jobTitle,
        department: rel.supervisor.staffProfile?.department,
        startDate: rel.startDate,
        endDate: rel.endDate,
        status: rel.status,
      })),
      
      supervisees: user.supervisionAsSupervisor.map(rel => ({
        id: rel.supervisee.id,
        firstName: rel.supervisee.firstName,
        lastName: rel.supervisee.lastName,
        email: rel.supervisee.email,
        jobTitle: rel.supervisee.staffProfile?.jobTitle,
        department: rel.supervisee.staffProfile?.department,
        startDate: rel.startDate,
        endDate: rel.endDate,
        status: rel.status,
      })),
      
      licenses: user.licenses.map(license => ({
        id: license.id,
        staffId: license.staffId,
        licenseType: license.licenseType,
        licenseNumber: license.licenseNumber,
        licenseExpirationDate: license.licenseExpirationDate.toISOString().split('T')[0],
        licenseStatus: license.licenseStatus,
        licenseState: license.licenseState,
        issuedBy: license.issuedBy,
        createdAt: license.createdAt.toISOString(),
        updatedAt: license.updatedAt.toISOString(),
      })),
    };

    return profile;
  }

  // Update current user's profile
  async updateMyProfile(userId: string, updateData: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        staffProfile: true,
        client: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Update user basic info
    const userUpdateData: any = {};
    if (updateData.firstName !== undefined) userUpdateData.firstName = updateData.firstName;
    if (updateData.lastName !== undefined) userUpdateData.lastName = updateData.lastName;
    if (updateData.middleName !== undefined) userUpdateData.middleName = updateData.middleName;
    if (updateData.suffix !== undefined) userUpdateData.suffix = updateData.suffix;
    if (updateData.email !== undefined) userUpdateData.email = updateData.email;
    if (updateData.userName !== undefined) userUpdateData.userName = updateData.userName;

    if (Object.keys(userUpdateData).length > 0) {
      userUpdateData.updatedAt = new Date();
      await this.prisma.user.update({
        where: { id: userId },
        data: userUpdateData,
      });
    }

    // Update staff profile if user is staff
    if (user.staffId && user.staffProfile) {
      const staffUpdateData: any = {};
      const staffFields = [
        'phoneNumber', 'mobilePhone', 'workPhone', 'homePhone', 'canReceiveText',
        'address1', 'address2', 'city', 'state', 'zipCode', 'formalName',
        'clinicianType', 'supervisionType', 'userComments', 'notes'
      ];

      staffFields.forEach(field => {
        if (updateData[field] !== undefined) {
          staffUpdateData[field] = updateData[field];
        }
      });

      if (Object.keys(staffUpdateData).length > 0) {
        staffUpdateData.updatedAt = new Date();
        await this.prisma.staffProfile.update({
          where: { id: user.staffId },
          data: staffUpdateData,
        });
      }
    }

    // Update client profile if user is client
    if (user.clientId && user.client) {
      const clientUpdateData: any = {};
      const clientFields = [
        'preferredName', 'pronouns', 'administrativeSex', 'genderIdentity',
        'sexualOrientation', 'address1', 'address2', 'timezone', 'race',
        'ethnicity', 'languages', 'maritalStatus', 'employmentStatus',
        'religiousAffiliation', 'smokingStatus', 'appointmentReminders',
        'patientComments'
      ];

      clientFields.forEach(field => {
        if (updateData[field] !== undefined) {
          clientUpdateData[field] = updateData[field];
        }
      });

      if (Object.keys(clientUpdateData).length > 0) {
        clientUpdateData.updatedAt = new Date();
        await this.prisma.client.update({
          where: { id: user.clientId },
          data: clientUpdateData,
        });
      }
    }

    // Return updated profile
    return this.getMyProfile(userId);
  }

  // Update current user's password
  async updatePassword(userId: string, passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new BadRequestException('All password fields are required');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirmation password do not match');
    }

    if (newPassword.length < 8) {
      throw new BadRequestException('New password must be at least 8 characters long');
    }

    // Get user with password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true, email: true }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      },
    });

    return {
      message: 'Password updated successfully',
      userId: user.id,
      email: user.email
    };
  }
} 