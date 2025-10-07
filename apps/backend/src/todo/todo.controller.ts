import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TodoService, AccountTodoItem, PatientTodoItem, AppointmentTodoItem, NoteTodoItem } from './todo.service';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

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
}
