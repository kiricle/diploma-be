import { IsNumber } from 'class-validator';

export class DeleteColumnDto {
  @IsNumber()
  id: number;
  
  @IsNumber()
  projectId: number;
}
