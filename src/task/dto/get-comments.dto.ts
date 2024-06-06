import { IsEmpty, IsString } from 'class-validator';

export class GetCommentsDto {
  @IsString()
  @IsEmpty()
  taskId: string;
}
