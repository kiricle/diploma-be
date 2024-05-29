import { IsNumber } from "class-validator";

export class ChangeColumnOrderDto {
    @IsNumber()
    id: number;

    @IsNumber()
    newOrder: number;
}