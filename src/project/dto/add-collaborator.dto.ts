import { IsEmail, IsNumber } from 'class-validator';

export class AddCollaboratorDto {
  @IsNumber()
  projectId: number;

  @IsEmail()
  email: string;
}
