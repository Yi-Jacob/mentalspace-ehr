import { IsEnum, IsString } from 'class-validator';

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class UpdateTodoStatusDto {
  @IsEnum(TodoStatus)
  status: TodoStatus;
}
