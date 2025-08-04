import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupervisionRelationshipsService } from './supervision-relationships.service';
import { CreateSupervisionRelationshipDto } from './dto/create-supervision-relationship.dto';
import { UpdateSupervisionRelationshipDto } from './dto/update-supervision-relationship.dto';

@Controller('supervision-relationships')
export class SupervisionRelationshipsController {
  constructor(private readonly supervisionRelationshipsService: SupervisionRelationshipsService) {}

  @Post()
  create(@Body() createSupervisionRelationshipDto: CreateSupervisionRelationshipDto) {
    return this.supervisionRelationshipsService.create(createSupervisionRelationshipDto);
  }

  @Get()
  findAll() {
    return this.supervisionRelationshipsService.findAll();
  }

  @Get('supervisor-candidates')
  getSupervisorCandidates() {
    return this.supervisionRelationshipsService.getSupervisorCandidates();
  }

  @Get('supervisee-candidates')
  getSuperviseeCandidates() {
    return this.supervisionRelationshipsService.getSuperviseeCandidates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supervisionRelationshipsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupervisionRelationshipDto: UpdateSupervisionRelationshipDto) {
    return this.supervisionRelationshipsService.update(id, updateSupervisionRelationshipDto);
  }
} 