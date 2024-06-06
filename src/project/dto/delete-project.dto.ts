import { IsNumber } from 'class-validator';

export class DeleteProjectDto {
  @IsNumber()
  id: number;
}
