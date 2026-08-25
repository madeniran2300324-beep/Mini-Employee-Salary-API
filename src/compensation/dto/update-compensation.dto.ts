import { SalaryFrequency } from "@prisma/client";
import { IsDateString, IsEnum, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateCompensationDto {
    @IsNumber()
    @IsOptional()
    @Min(70000)
    salary?: number;

    @IsOptional()
    @IsEnum(SalaryFrequency)
    salaryFrequency?: SalaryFrequency;

    @IsDateString()
    @IsOptional()
    effectiveFrom?: Date;

}