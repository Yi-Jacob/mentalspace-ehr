import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('billing/contract')
@UseGuards(JwtAuthGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  async getAllContracts(@Query('status') status?: string, @Query('providerId') providerId?: string) {
    return this.contractService.getAllContracts(status, providerId);
  }

  @Get(':id')
  async getContractById(@Param('id') id: string) {
    return this.contractService.getContractById(id);
  }

  @Post()
  async createContract(@Body() createContractDto: CreateContractDto) {
    return this.contractService.createContract(createContractDto);
  }

  @Put(':id')
  async updateContract(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractService.updateContract(id, updateContractDto);
  }

  @Delete(':id')
  async deleteContract(@Param('id') id: string) {
    return this.contractService.deleteContract(id);
  }
} 