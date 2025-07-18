import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ClientsService } from '../services/clients.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { QueryClientDto } from '../dto/query-client.dto';
import { Client } from '../entities/client.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: Client,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - client with this email already exists',
  })
  async create(
    @Body() createClientDto: CreateClientDto,
    @Request() req: any,
  ): Promise<Client> {
    return this.clientsService.create(createClientDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all clients with pagination and filtering' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for client name or email' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc/desc)' })
  @ApiResponse({
    status: 200,
    description: 'Clients retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        clients: {
          type: 'array',
          items: { $ref: '#/components/schemas/Client' },
        },
        total: { type: 'number' },
      },
    },
  })
  async findAll(@Query() query: QueryClientDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description: 'Client retrieved successfully',
    type: Client,
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  async findOne(@Param('id') id: string): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update a client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
    type: Client,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - client with this email already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: any,
  ): Promise<Client> {
    return this.clientsService.update(id, updateClientDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client (soft delete)' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: 204,
    description: 'Client deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    return this.clientsService.remove(id, req.user.id);
  }

  @Get('search/email')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN, UserRole.STAFF)
  @ApiOperation({ summary: 'Find a client by email' })
  @ApiQuery({ name: 'email', required: true, description: 'Client email' })
  @ApiResponse({
    status: 200,
    description: 'Client found successfully',
    type: Client,
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  async findByEmail(@Query('email') email: string): Promise<Client | null> {
    return this.clientsService.findByEmail(email);
  }
} 