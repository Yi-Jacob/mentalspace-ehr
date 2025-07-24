import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionCompletionDto } from './create-session-completion.dto';

export class UpdateSessionCompletionDto extends PartialType(CreateSessionCompletionDto) {} 