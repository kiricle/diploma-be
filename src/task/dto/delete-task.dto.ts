import { IsNumber } from 'class-validator';

export class DeleteTaskDto {
  @IsNumber()
  id: number;

  @IsNumber()
  columnId: number;
}
