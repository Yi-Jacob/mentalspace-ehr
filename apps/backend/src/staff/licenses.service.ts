import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';

@Injectable()
export class LicensesService {
  constructor(private prisma: PrismaService) {}

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

  async create(createLicenseDto: CreateLicenseDto) {
    try {
      const license = await this.prisma.license.create({
        data: {
          staffId: createLicenseDto.staffId,
          licenseType: createLicenseDto.licenseType,
          licenseNumber: createLicenseDto.licenseNumber,
          licenseExpirationDate: this.parseDate(createLicenseDto.licenseExpirationDate) || new Date(),
          licenseStatus: createLicenseDto.licenseStatus,
          licenseState: createLicenseDto.licenseState,
          issuedBy: createLicenseDto.issuedBy,
        },
        include: {
          staff: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return license;
    } catch (error) {
      console.error('Error creating license:', error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.license.findMany({
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByStaffId(staffId: string) {
    return this.prisma.license.findMany({
      where: {
        staffId: staffId,
      },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const license = await this.prisma.license.findUnique({
      where: { id },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!license) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }

    return license;
  }

  async update(id: string, updateLicenseDto: UpdateLicenseDto) {
    try {
      // Check if license exists
      const existingLicense = await this.prisma.license.findUnique({
        where: { id },
      });

      if (!existingLicense) {
        throw new NotFoundException(`License with ID ${id} not found`);
      }

      const updateData: any = {};
      
      if (updateLicenseDto.licenseType !== undefined) {
        updateData.licenseType = updateLicenseDto.licenseType;
      }
      if (updateLicenseDto.licenseNumber !== undefined) {
        updateData.licenseNumber = updateLicenseDto.licenseNumber;
      }
      if (updateLicenseDto.licenseExpirationDate !== undefined) {
        updateData.licenseExpirationDate = this.parseDate(updateLicenseDto.licenseExpirationDate);
      }
      if (updateLicenseDto.licenseStatus !== undefined) {
        updateData.licenseStatus = updateLicenseDto.licenseStatus;
      }
      if (updateLicenseDto.licenseState !== undefined) {
        updateData.licenseState = updateLicenseDto.licenseState;
      }
      if (updateLicenseDto.issuedBy !== undefined) {
        updateData.issuedBy = updateLicenseDto.issuedBy;
      }

      updateData.updatedAt = new Date();

      const license = await this.prisma.license.update({
        where: { id },
        data: updateData,
        include: {
          staff: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return license;
    } catch (error) {
      console.error('Error updating license:', error);
      throw error;
    }
  }

  async remove(id: string) {
    // Check if license exists
    const existingLicense = await this.prisma.license.findUnique({
      where: { id },
    });

    if (!existingLicense) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }

    return this.prisma.license.delete({
      where: { id },
    });
  }

  async removeByStaffId(staffId: string) {
    return this.prisma.license.deleteMany({
      where: { staffId },
    });
  }
} 