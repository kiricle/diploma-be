import { IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;
  
  @IsNumber()
  columnId: number;
}
