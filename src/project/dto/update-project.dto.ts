import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsNumber()
  id: number;

  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  collaboratorEmail: string;
}
