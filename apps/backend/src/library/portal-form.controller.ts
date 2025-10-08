import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PortalFormService } from './portal-form.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePortalFormDto, UpdatePortalFormDto, SubmitPortalFormResponseDto } from './dto/portal-form.dto';

@Controller('portal-forms')
@UseGuards(JwtAuthGuard)
export class PortalFormController {
  constructor(private readonly portalFormService: PortalFormService) {}

  @Get()
  async getAllPortalForms(@Request() req) {
    return this.portalFormService.getAllPortalForms(req.user.id);
  }

  @Get('shareable')
  async getShareablePortalForms() {
    return this.portalFormService.getShareablePortalForms();
  }

  @Get(':id')
  async getPortalFormById(@Param('id') id: string) {
    return this.portalFormService.getPortalFormById(id);
  }

  @Post()
  async createPortalForm(@Body() createPortalFormDto: CreatePortalFormDto, @Request() req) {
    return this.portalFormService.createPortalForm(createPortalFormDto, req.user.id);
  }

  @Put(':id')
  async updatePortalForm(@Param('id') id: string, @Body() updatePortalFormDto: UpdatePortalFormDto, @Request() req) {
    return this.portalFormService.updatePortalForm(id, updatePortalFormDto, req.user.id);
  }

  @Delete(':id')
  async deletePortalForm(@Param('id') id: string, @Request() req) {
    return this.portalFormService.deletePortalForm(id, req.user.id);
  }

  @Post('responses/:id')
  async submitPortalFormResponse(
    @Param('id') id: string,
    @Body() submitResponseDto: SubmitPortalFormResponseDto,
    @Request() req
  ) {
    return this.portalFormService.submitPortalFormResponse(id, submitResponseDto, req.user.id);
  }

  @Get('responses/:responseId')
  async getPortalFormResponseById(
    @Param('responseId') responseId: string
  ) {
    return this.portalFormService.getPortalFormResponseById(responseId);
  }
}
