import { IsNumber } from 'class-validator';

export class DeleteCollaboratorDto {
  @IsNumber()
  id: number;

  @IsNumber()
  projectId: number;
}
