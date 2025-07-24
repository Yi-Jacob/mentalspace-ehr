import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@Controller('billing/contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getAllContracts(@Query('payerId') payerId?: string) {
    return this.contractService.getAllContracts(payerId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.BILLING)
  async getContractById(@Param('id') id: string) {
    return this.contractService.getContractById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async createContract(@Body() createContractDto: CreateContractDto) {
    return this.contractService.createContract(createContractDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async updateContract(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractService.updateContract(id, updateContractDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async deleteContract(@Param('id') id: string) {
    return this.contractService.deleteContract(id);
  }
} 