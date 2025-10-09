import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OutcomeMeasureService } from './outcome-measure.service';
import { CreateOutcomeMeasureDto } from './dto/create-outcome-measure.dto';
import { UpdateOutcomeMeasureDto } from './dto/update-outcome-measure.dto';
import { SubmitOutcomeMeasureResponseDto } from './dto/submit-outcome-measure-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('outcome-measures')
@UseGuards(JwtAuthGuard)
export class OutcomeMeasureController {
  constructor(private readonly outcomeMeasureService: OutcomeMeasureService) {}

  /**
   * Get all outcome measures
   */
  @Get()
  async getAllOutcomeMeasures(@Request() req: any) {
    return this.outcomeMeasureService.getAllOutcomeMeasures(req.user.id);
  }

  /**
   * Create a new outcome measure
   */
  @Post()
  async createOutcomeMeasure(
    @Body() createMeasureDto: CreateOutcomeMeasureDto,
    @Request() req: any,
  ) {
    return this.outcomeMeasureService.createOutcomeMeasure(createMeasureDto, req.user.id);
  }

  /**
   * Get a single outcome measure by ID
   */
  @Get(':measureId')
  async getOutcomeMeasureById(
    @Param('measureId') measureId: string,
    @Request() req: any,
  ) {
    return this.outcomeMeasureService.getOutcomeMeasureById(measureId, req.user.id);
  }

  /**
   * Update an outcome measure
   */
  @Put(':measureId')
  async updateOutcomeMeasure(
    @Param('measureId') measureId: string,
    @Body() updateMeasureDto: UpdateOutcomeMeasureDto,
    @Request() req: any,
  ) {
    return this.outcomeMeasureService.updateOutcomeMeasure(measureId, updateMeasureDto, req.user.id);
  }

  /**
   * Delete an outcome measure
   */
  @Delete(':measureId')
  @HttpCode(HttpStatus.OK)
  async deleteOutcomeMeasure(
    @Param('measureId') measureId: string,
    @Request() req: any,
  ) {
    return this.outcomeMeasureService.deleteOutcomeMeasure(measureId, req.user.id);
  }

  /**
   * Get shareable outcome measures
   */
  @Get('shareable/list')
  async getShareableOutcomeMeasures() {
    return this.outcomeMeasureService.getShareableOutcomeMeasures();
  }

  /**
   * Submit outcome measure response
   */
  @Post('responses')
  async submitOutcomeMeasureResponse(
    @Body() submitResponseDto: SubmitOutcomeMeasureResponseDto,
    @Request() req: any,
  ) {
    return this.outcomeMeasureService.submitOutcomeMeasureResponse(submitResponseDto, req.user.id);
  }

  /**
   * Get outcome measure response
   */
  @Get('responses/:responseId')
  async getOutcomeMeasureResponse(
    @Param('responseId') responseId: string,
    @Request() req: any,
  ) {
    return this.outcomeMeasureService.getOutcomeMeasureResponse(responseId, req.user.id);
  }
}
