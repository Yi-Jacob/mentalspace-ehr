import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePortalFormDto, UpdatePortalFormDto, SubmitPortalFormResponseDto } from './dto/portal-form.dto';

@Injectable()
export class PortalFormService {
  constructor(private prisma: PrismaService) { }

  async getAllPortalForms(userId: string) {
    const forms = await this.prisma.portalForm.findMany({
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return forms;
  }

  async getShareablePortalForms() {
    const forms = await this.prisma.portalForm.findMany({
      where: {
        sharable: 'sharable',
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return forms;
  }

  async getPortalFormById(id: string) {
    const form = await this.prisma.portalForm.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!form) {
      throw new NotFoundException('Portal form not found');
    }

    return form;
  }

  async createPortalForm(createPortalFormDto: CreatePortalFormDto, userId: string) {
    const form = await this.prisma.portalForm.create({
      data: {
        ...createPortalFormDto,
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return form;
  }

  async updatePortalForm(id: string, updatePortalFormDto: UpdatePortalFormDto, userId: string) {
    const existingForm = await this.prisma.portalForm.findUnique({
      where: { id },
    });

    if (!existingForm) {
      throw new NotFoundException('Portal form not found');
    }

    if (existingForm.createdBy !== userId) {
      throw new ForbiddenException('You can only update your own portal forms');
    }

    const form = await this.prisma.portalForm.update({
      where: { id },
      data: {
        ...updatePortalFormDto,
        updatedAt: new Date(),
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return form;
  }

  async deletePortalForm(id: string, userId: string) {
    const existingForm = await this.prisma.portalForm.findUnique({
      where: { id },
    });

    if (!existingForm) {
      throw new NotFoundException('Portal form not found');
    }

    if (existingForm.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own portal forms');
    }

    await this.prisma.portalForm.delete({
      where: { id },
    });

    return { message: 'Portal form deleted successfully' };
  }

  async submitPortalFormResponse(
    portalFormResponseId: string,
    submitResponseDto: SubmitPortalFormResponseDto,
    userId: string
  ) {

    // Check if user already submitted a response for this client file
    const existingResponse = await this.prisma.portalFormResponse.findUnique({
      where: {
        id: portalFormResponseId,
      },
    });

    if (!existingResponse) {
      throw new NotFoundException('Portal form response not found');
    }

    const response = await this.prisma.portalFormResponse.update({
      where: { id: existingResponse.id },
      data: {
        content: submitResponseDto.content,
        signature: submitResponseDto.signature,
        updatedAt: new Date(),
      },
      include: {
        clientFile: {
          include: {
            portalForm: {
              select: {
                id: true,
                title: true,
              },
            },
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return response;
  }

  async getPortalFormResponseById(responseId: string) {
    console.log('Getting portal form response by ID:', responseId);

    // Get the response by ID with related data
    const response = await this.prisma.portalFormResponse.findUnique({
      where: { id: responseId },
      include: {
        clientFile: {
          include: {
            portalForm: {
              select: {
                id: true,
                title: true,
                description: true,
                panelContent: true,
              },
            },
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!response) {
      throw new NotFoundException('Portal form response not found');
    }

    return response;
  }
}
