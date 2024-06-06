import { IsNumber, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  title: string;

  @IsNumber()
  id: number;

  @IsString()
  description: string;

  @IsNumber()
  columnId: number;
}
