import { IsEmail, IsNumber } from 'class-validator';

export class AddCollaboratorDto {
  @IsNumber()
  id: number;

  @IsEmail()
  collaboratorEmail: string;
}
