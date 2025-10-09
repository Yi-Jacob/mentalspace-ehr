import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOutcomeMeasureDto } from './dto/create-outcome-measure.dto';
import { UpdateOutcomeMeasureDto } from './dto/update-outcome-measure.dto';
import { SubmitOutcomeMeasureResponseDto } from './dto/submit-outcome-measure-response.dto';

@Injectable()
export class OutcomeMeasureService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all outcome measures
   */
  async getAllOutcomeMeasures(userId: string) {
    // Get user to check access level
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has admin role
    const isAdmin = user.userRoles.some(role => role.role === 'admin');
    const isClinician = user.userRoles.some(role => role.role === 'clinician');
    const isBilling = user.userRoles.some(role => role.role === 'billing');

    // Build access level filter
    const accessLevels = ['admin'];
    if (isClinician) accessLevels.push('clinician');
    if (isBilling) accessLevels.push('billing');

    const measures = await this.prisma.outcomeMeasure.findMany({
      where: {
        accessLevel: {
          in: accessLevels,
        },
      },
      include: {
        creator: {
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

    return measures;
  }

  /**
   * Create a new outcome measure
   */
  async createOutcomeMeasure(createMeasureDto: CreateOutcomeMeasureDto, createdBy: string) {
    // Validate content structure
    this.validateOutcomeMeasureContent(createMeasureDto.content);

    const measure = await this.prisma.outcomeMeasure.create({
      data: {
        title: createMeasureDto.title,
        description: createMeasureDto.description,
        sharable: createMeasureDto.sharable || 'not_sharable',
        accessLevel: createMeasureDto.accessLevel || 'admin',
        content: createMeasureDto.content as any,
        createdBy: createdBy,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return measure;
  }

  /**
   * Get a single outcome measure by ID
   */
  async getOutcomeMeasureById(measureId: string, userId: string) {
    const measure = await this.prisma.outcomeMeasure.findUnique({
      where: { id: measureId },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!measure) {
      throw new NotFoundException('Outcome measure not found');
    }

    return measure;
  }

  /**
   * Update an outcome measure
   */
  async updateOutcomeMeasure(measureId: string, updateMeasureDto: UpdateOutcomeMeasureDto, userId: string) {
    const measure = await this.prisma.outcomeMeasure.findUnique({
      where: { id: measureId },
    });

    if (!measure) {
      throw new NotFoundException('Outcome measure not found');
    }

    // Check if user can update the measure (only creator or admin)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
        },
      },
    });

    const isAdmin = user?.userRoles.some(role => role.role === 'admin');
    const isCreator = measure.createdBy === userId;

    if (!isAdmin && !isCreator) {
      throw new ForbiddenException('Only the measure creator or admin can update this measure');
    }

    // Validate content structure if provided
    if (updateMeasureDto.content) {
      this.validateOutcomeMeasureContent(updateMeasureDto.content);
    }

    const updatedMeasure = await this.prisma.outcomeMeasure.update({
      where: { id: measureId },
      data: {
        title: updateMeasureDto.title,
        description: updateMeasureDto.description,
        sharable: updateMeasureDto.sharable,
        accessLevel: updateMeasureDto.accessLevel,
        content: updateMeasureDto.content as any,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedMeasure;
  }

  /**
   * Delete an outcome measure
   */
  async deleteOutcomeMeasure(measureId: string, userId: string) {
    const measure = await this.prisma.outcomeMeasure.findUnique({
      where: { id: measureId },
    });

    if (!measure) {
      throw new NotFoundException('Outcome measure not found');
    }

    // Check if user can delete the measure (only creator or admin)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
        },
      },
    });

    const isAdmin = user?.userRoles.some(role => role.role === 'admin');
    const isCreator = measure.createdBy === userId;

    if (!isAdmin && !isCreator) {
      throw new ForbiddenException('Only the measure creator or admin can delete this measure');
    }

    await this.prisma.outcomeMeasure.delete({
      where: { id: measureId },
    });

    return { message: 'Outcome measure deleted successfully' };
  }

  /**
   * Get shareable outcome measures
   */
  async getShareableOutcomeMeasures() {
    const measures = await this.prisma.outcomeMeasure.findMany({
      where: {
        sharable: 'sharable',
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
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

    return measures;
  }

  /**
   * Submit outcome measure response
   */
  async submitOutcomeMeasureResponse(submitResponseDto: SubmitOutcomeMeasureResponseDto, userId: string) {
    const { clientFileId, responses } = submitResponseDto;

    // Get the client file
    const clientFile = await this.prisma.clientFile.findUnique({
      where: { id: clientFileId },
      include: {
        outcomeMeasure: true,
        client: true,
      },
    });

    if (!clientFile) {
      throw new NotFoundException('Client file not found');
    }

    if (!clientFile.outcomeMeasure) {
      throw new BadRequestException('This client file is not linked to an outcome measure');
    }

    // Verify the user is the client
    if (clientFile.clientId !== userId) {
      throw new ForbiddenException('Only the client can submit responses');
    }

    // Calculate total score and determine criteria
    const { totalScore, criteria } = this.calculateScoreAndCriteria(
      clientFile.outcomeMeasure.content as any,
      responses
    );

    // Create or update the response
    const outcomeMeasureResponse = await this.prisma.outcomeMeasureResponse.upsert({
      where: { clientFileId },
      update: {
        responses: responses as any,
        totalScore,
        criteria,
      },
      create: {
        clientFileId,
        responses: responses as any,
        totalScore,
        criteria,
      },
    });

    // Update client file status
    await this.prisma.clientFile.update({
      where: { id: clientFileId },
      data: {
        status: 'completedbyclient',
        completedDate: new Date(),
      },
    });

    return outcomeMeasureResponse;
  }

  /**
   * Get outcome measure response
   */
  async getOutcomeMeasureResponse(responseId: string, userId: string) {
    const response = await this.prisma.outcomeMeasureResponse.findUnique({
      where: { id: responseId },
      include: {
        clientFile: {
          include: {
            client: true,
            outcomeMeasure: true,
          },
        },
      },
    });

    if (!response) {
      throw new NotFoundException('Response not found');
    }

    // Check access permissions
    const requestingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        client: true,
        staffProfile: true,
      },
    });

    if (!requestingUser) {
      throw new NotFoundException('User not found');
    }

    // Allow access if:
    // 1. The user is the client who owns the response
    // 2. The user is staff
    const isClient = requestingUser.clientId === response.clientFile.client.clientId;
    const isStaff = requestingUser.staffProfile !== null;

    if (!isClient && !isStaff) {
      throw new ForbiddenException('You can only access your own responses');
    }

    return response;
  }

  /**
   * Validate outcome measure content structure
   */
  private validateOutcomeMeasureContent(content: any) {
    if (!content.questions || !Array.isArray(content.questions)) {
      throw new BadRequestException('Content must have questions array');
    }

    if (!content.scoringCriteria || !Array.isArray(content.scoringCriteria)) {
      throw new BadRequestException('Content must have scoringCriteria array');
    }

    if (content.questions.length === 0) {
      throw new BadRequestException('At least one question is required');
    }

    if (content.scoringCriteria.length === 0) {
      throw new BadRequestException('At least one scoring criterion is required');
    }

    // Validate each question
    content.questions.forEach((question: any, index: number) => {
      if (!question.id || !question.question || !question.type || !question.options) {
        throw new BadRequestException(`Question ${index + 1} is missing required fields`);
      }

      if (!['single_choice', 'multiple_choice', 'scale'].includes(question.type)) {
        throw new BadRequestException(`Question ${index + 1} has invalid type`);
      }

      if (!Array.isArray(question.options) || (question.options.length === 0 && question.type !== 'scale')) {
        throw new BadRequestException(`Question ${index + 1} must have at least one option`);
      }

      // Validate each option
      question.options.forEach((option: any, optionIndex: number) => {
        if (!option.id || !option.text || typeof option.score !== 'number') {
          throw new BadRequestException(`Question ${index + 1}, Option ${optionIndex + 1} is missing required fields`);
        }
      });
    });

    // Validate scoring criteria
    content.scoringCriteria.forEach((criterion: any, index: number) => {
      if (!criterion.id || !criterion.label || typeof criterion.minScore !== 'number' || typeof criterion.maxScore !== 'number') {
        throw new BadRequestException(`Scoring criterion ${index + 1} is missing required fields`);
      }

      if (criterion.minScore > criterion.maxScore) {
        throw new BadRequestException(`Scoring criterion ${index + 1} has invalid score range`);
      }
    });
  }

  /**
   * Calculate total score and determine criteria
   */
  private calculateScoreAndCriteria(content: any, responses: any[]) {
    let totalScore = 0;

    // Calculate total score from responses
    responses.forEach((response) => {
      totalScore += response.score;
    });

    // Find matching criteria
    let criteria = 'Unknown';
    for (const criterion of content.scoringCriteria) {
      if (totalScore >= criterion.minScore && totalScore <= criterion.maxScore) {
        criteria = criterion.label;
        break;
      }
    }

    return { totalScore, criteria };
  }
}
