import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { StatementsService } from './statements.service';
import { CreateStatementDto } from './dto/create-statement.dto';
import { UpdateStatementDto } from './dto/update-statement.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('billing/statements')
@UseGuards(JwtAuthGuard)
export class StatementsController {
  constructor(private readonly statementsService: StatementsService) {}

  @Get()
  async getAllStatements(@Query('status') status?: string, @Query('search') search?: string) {
    return this.statementsService.getAllStatements(status, search);
  }

  @Get(':id')
  async getStatementById(@Param('id') id: string) {
    return this.statementsService.getStatementById(id);
  }

  @Post()
  async createStatement(@Body() createStatementDto: CreateStatementDto, @Request() req: any) {
    return this.statementsService.createStatement(createStatementDto, req.user.id);
  }

  @Put(':id')
  async updateStatement(@Param('id') id: string, @Body() updateStatementDto: UpdateStatementDto) {
    return this.statementsService.updateStatement(id, updateStatementDto);
  }

  @Delete(':id')
  async deleteStatement(@Param('id') id: string) {
    return this.statementsService.deleteStatement(id);
  }

  @Post(':id/send')
  async markAsSent(@Param('id') id: string) {
    return this.statementsService.markAsSent(id);
  }

  @Post(':id/open')
  async markAsOpened(@Param('id') id: string) {
    return this.statementsService.markAsOpened(id);
  }

  @Get('generate-number')
  async generateStatementNumber() {
    return { statementNumber: await this.statementsService.generateStatementNumber() };
  }

  // Statement Line Item endpoints
  @Post(':id/line-items')
  async createStatementLineItem(@Param('id') statementId: string, @Body() lineItemData: any) {
    return this.statementsService.createStatementLineItem(statementId, lineItemData);
  }

  @Put('line-items/:lineItemId')
  async updateStatementLineItem(@Param('lineItemId') id: string, @Body() lineItemData: any) {
    return this.statementsService.updateStatementLineItem(id, lineItemData);
  }

  @Delete('line-items/:lineItemId')
  async deleteStatementLineItem(@Param('lineItemId') id: string) {
    return this.statementsService.deleteStatementLineItem(id);
  }
}
