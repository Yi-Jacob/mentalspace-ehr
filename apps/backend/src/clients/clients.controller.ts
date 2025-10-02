import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

// Interface for the authenticated user from JWT
interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'List of all clients' })
  async findAll(@Request() req: { user: AuthenticatedUser }) {
    const user = req.user;
    // Define role groups
    const adminRoles = ['Practice Administrator', 'Clinical Administrator', 'Practice Scheduler'];
    const clinicianRoles = ['Clinician', 'Intern', 'Assistant', 'Associate'];
    const supervisorRoles = ['Supervisor'];
    
    // Check if user has admin roles - full access
    if (user.roles.some(role => adminRoles.includes(role))) {
      return this.clientsService.findAllForAdmin();
    }
    
    // Check if user has supervisor role - own clients + supervisee clients
    if (user.roles.some(role => supervisorRoles.includes(role))) {
      return this.clientsService.findClientsForSupervisor(user.id);
    }
    
    // Check if user has clinician roles - only assigned clients
    if (user.roles.some(role => clinicianRoles.includes(role))) {
      // Get user's staff profile ID
      const staffProfile = await this.clientsService.getStaffProfileByUserId(user.id);
      if (staffProfile) {
        return this.clientsService.findClientsByClinicianId(staffProfile.id);
      }
    }
    
    // Default: return empty array if no matching roles
    return [];
  }

  @Get('for-notes')
  @ApiOperation({ summary: 'Get clients for notes and messages' })
  @ApiResponse({ status: 200, description: 'List of clients for notes' })
  async getClientsForNotes(@Request() req: { user: AuthenticatedUser }) {
    const user = req.user;
    return this.clientsService.getClientsForNotes(user.id, user.roles);
  }

  @Get('staff-profiles')
  @ApiOperation({ summary: 'Get all staff profiles for clinician assignment' })
  @ApiResponse({ status: 200, description: 'List of staff profiles' })
  getStaffProfiles() {
    return this.clientsService.getStaffProfiles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by id' })
  @ApiResponse({ status: 200, description: 'Client found' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  // Phone numbers
  @Get(':id/phone-numbers')
  @ApiOperation({ summary: 'Get client phone numbers' })
  @ApiResponse({ status: 200, description: 'Client phone numbers' })
  getPhoneNumbers(@Param('id') id: string) {
    return this.clientsService.getClientPhoneNumbers(id);
  }

  @Put(':id/phone-numbers')
  @ApiOperation({ summary: 'Update client phone numbers' })
  @ApiResponse({ status: 200, description: 'Phone numbers updated successfully' })
  updatePhoneNumbers(@Param('id') id: string, @Body() phoneNumbers: any[]) {
    return this.clientsService.updateClientPhoneNumbers(id, phoneNumbers);
  }

  // Emergency contacts
  @Get(':id/emergency-contacts')
  @ApiOperation({ summary: 'Get client emergency contacts' })
  @ApiResponse({ status: 200, description: 'Client emergency contacts' })
  getEmergencyContacts(@Param('id') id: string) {
    return this.clientsService.getClientEmergencyContacts(id);
  }

  @Put(':id/emergency-contacts')
  @ApiOperation({ summary: 'Update client emergency contacts' })
  @ApiResponse({ status: 200, description: 'Emergency contacts updated successfully' })
  updateEmergencyContacts(@Param('id') id: string, @Body() contacts: any[]) {
    return this.clientsService.updateClientEmergencyContacts(id, contacts);
  }

  // Insurance
  @Get(':id/insurance')
  @ApiOperation({ summary: 'Get client insurance' })
  @ApiResponse({ status: 200, description: 'Client insurance' })
  getInsurance(@Param('id') id: string) {
    return this.clientsService.getClientInsurance(id);
  }

  @Put(':id/insurance')
  @ApiOperation({ summary: 'Update client insurance' })
  @ApiResponse({ status: 200, description: 'Insurance updated successfully' })
  updateInsurance(@Param('id') id: string, @Body() insurance: any[]) {
    return this.clientsService.updateClientInsurance(id, insurance);
  }

  // Primary care provider
  @Get(':id/primary-care-provider')
  @ApiOperation({ summary: 'Get client primary care provider' })
  @ApiResponse({ status: 200, description: 'Client primary care provider' })
  getPrimaryCareProvider(@Param('id') id: string) {
    return this.clientsService.getClientPrimaryCareProvider(id);
  }

  @Put(':id/primary-care-provider')
  @ApiOperation({ summary: 'Update client primary care provider' })
  @ApiResponse({ status: 200, description: 'Primary care provider updated successfully' })
  updatePrimaryCareProvider(@Param('id') id: string, @Body() pcp: any) {
    return this.clientsService.updateClientPrimaryCareProvider(id, pcp);
  }

  // Create client with form data
  @Post('with-form-data')
  @ApiOperation({ summary: 'Create a client with all related data' })
  @ApiResponse({ status: 201, description: 'Client created successfully with all data' })
  createWithFormData(@Body() data: {
    clientData: CreateClientDto;
    phoneNumbers: any[];
    emergencyContacts: any[];
    insuranceInfo: any[];
    primaryCareProvider: any;
  }) {
    return this.clientsService.createClientWithFormData(
      data.clientData,
      data.phoneNumbers,
      data.emergencyContacts,
      data.insuranceInfo,
      data.primaryCareProvider,
    );
  }

  // Update client with form data
  @Put(':id/with-form-data')
  @ApiOperation({ summary: 'Update a client with all related data' })
  @ApiResponse({ status: 200, description: 'Client updated successfully with all data' })
  updateWithFormData(
    @Param('id') id: string,
    @Body() data: {
      clientData: UpdateClientDto;
      phoneNumbers: any[];
      emergencyContacts: any[];
      insuranceInfo: any[];
      primaryCareProvider: any;
    },
  ) {
    return this.clientsService.updateClientWithFormData(
      id,
      data.clientData,
      data.phoneNumbers,
      data.emergencyContacts,
      data.insuranceInfo,
      data.primaryCareProvider,
    );
  }

  @Post(':id/clinicians/:clinicianId')
  @ApiOperation({ summary: 'Assign clinician to client' })
  @ApiResponse({ status: 201, description: 'Clinician assigned successfully' })
  @ApiResponse({ status: 404, description: 'Client or clinician not found' })
  @ApiResponse({ status: 409, description: 'Clinician already assigned' })
  assignClinician(
    @Param('id') clientId: string,
    @Param('clinicianId') clinicianId: string,
    @Request() req: any,
  ) {
    return this.clientsService.addClinicianToClient(
      clientId,
      clinicianId,
      req.user?.id,
    );
  }

  @Delete(':id/clinicians/:clinicianId')
  @ApiOperation({ summary: 'Remove clinician from client' })
  @ApiResponse({ status: 200, description: 'Clinician removed successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  removeClinician(
    @Param('id') clientId: string,
    @Param('clinicianId') clinicianId: string,
  ) {
    return this.clientsService.removeClinicianFromClient(clientId, clinicianId);
  }

  @Get(':id/clinicians')
  @ApiOperation({ summary: 'Get all clinicians assigned to client' })
  @ApiResponse({ status: 200, description: 'List of assigned clinicians' })
  getClientClinicians(@Param('id') clientId: string) {
    return this.clientsService.getClientClinicians(clientId);
  }

  @Post(':id/resend-welcome-email')
  @ApiOperation({ summary: 'Resend welcome email to client' })
  @ApiResponse({ status: 200, description: 'Welcome email sent successfully' })
  @ApiResponse({ status: 400, description: 'Client already has password or email not found' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  resendWelcomeEmail(@Param('id') clientId: string) {
    return this.clientsService.resendWelcomeEmail(clientId);
  }
}