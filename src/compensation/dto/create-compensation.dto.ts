import { SalaryFrequency } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateCompensationDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(70000)
    salary!: number;

    @IsNotEmpty()
    @IsEnum(SalaryFrequency)
    salaryFrequency!: SalaryFrequency;

    @IsDateString()
    @IsNotEmpty()
    effectiveFrom!: Date;
}