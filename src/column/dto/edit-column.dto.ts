import { IsNumber, IsString } from "class-validator";

export class EditColumnDto {
  @IsNumber()
  projectId: number;
  
  @IsString()
  title: string;
  
  @IsNumber()
  id: number;
}
