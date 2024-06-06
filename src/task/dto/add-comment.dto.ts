import { IsNumber, IsString } from 'class-validator';

export class AddCommentDto {
  @IsString()
  content: string;

  @IsNumber()
  taskId: number;
}
