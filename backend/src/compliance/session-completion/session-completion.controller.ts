import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SessionCompletionService } from './session-completion.service';
import { CreateSessionCompletionDto } from './dto/create-session-completion.dto';
import { UpdateSessionCompletionDto } from './dto/update-session-completion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('compliance/session-completions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionCompletionController {
  constructor(private readonly sessionCompletionService: SessionCompletionService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllSessionCompletions(
    @Query('status') status?: string,
    @Query('providerId') providerId?: string,
    @Query('clientId') clientId?: string
  ) {
    return this.sessionCompletionService.getAllSessionCompletions(status, providerId, clientId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getSessionCompletionById(@Param('id') id: string) {
    return this.sessionCompletionService.getSessionCompletionById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async createSessionCompletion(@Body() createSessionCompletionDto: CreateSessionCompletionDto) {
    return this.sessionCompletionService.createSessionCompletion(createSessionCompletionDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async updateSessionCompletion(@Param('id') id: string, @Body() updateSessionCompletionDto: UpdateSessionCompletionDto) {
    return this.sessionCompletionService.updateSessionCompletion(id, updateSessionCompletionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteSessionCompletion(@Param('id') id: string) {
    return this.sessionCompletionService.deleteSessionCompletion(id);
  }

  @Post(':id/sign-note')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  async signNote(@Param('id') id: string, @Body() signNoteDto: { signedBy: string }) {
    return this.sessionCompletionService.signNote(id, signNoteDto.signedBy);
  }

  @Post(':id/lock-session')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async lockSession(@Param('id') id: string, @Body() lockSessionDto: { lockedBy: string; reason?: string }) {
    return this.sessionCompletionService.lockSession(id, lockSessionDto.lockedBy, lockSessionDto.reason);
  }

  @Post(':id/supervisor-override')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async supervisorOverride(
    @Param('id') id: string,
    @Body() overrideDto: { overrideBy: string; reason: string }
  ) {
    return this.sessionCompletionService.supervisorOverride(id, overrideDto.overrideBy, overrideDto.reason);
  }
} 