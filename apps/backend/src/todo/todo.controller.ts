import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TodoService, TodoItem, TodoStats, AccountTodoItem, PatientTodoItem, AppointmentTodoItem, NoteTodoItem } from './todo.service';
import { TodoFiltersDto } from './dto/todo-filters.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';

@Controller('api/todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTodos(@Query() filters: TodoFiltersDto, @Request() req): Promise<TodoItem[]> {
    return this.todoService.getTodos(filters, req.user);
  }

  @Get('stats')
  async getTodoStats(@Request() req): Promise<TodoStats> {
    return this.todoService.getTodoStats(req.user);
  }

  @Get('account')
  async getAccountTodos(@Request() req): Promise<AccountTodoItem[]> {
    return this.todoService.getAccountTodos(req.user);
  }

  @Get('patients')
  async getPatientTodos(@Request() req): Promise<PatientTodoItem[]> {
    return this.todoService.getPatientTodos(req.user);
  }

  @Get('appointments')
  async getAppointmentTodos(@Request() req): Promise<AppointmentTodoItem[]> {
    return this.todoService.getAppointmentTodos(req.user);
  }

  @Get('notes')
  async getNoteTodos(@Request() req): Promise<NoteTodoItem[]> {
    return this.todoService.getNoteTodos(req.user);
  }

  @Patch(':id/status')
  async updateTodoStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTodoStatusDto,
    @Request() req,
  ): Promise<TodoItem> {
    return this.todoService.updateTodoStatus(id, updateStatusDto.status, req.user);
  }

  @Patch(':id/complete')
  async markTodoComplete(@Param('id') id: string, @Request() req): Promise<TodoItem> {
    return this.todoService.markTodoComplete(id, req.user);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string, @Request() req) {
    return this.todoService.deleteTodo(id, req.user);
  }
}
