import { EmployeeStatus } from '@prisma/client';
import { IsString, IsEmail, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  employeeNumber?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  jobTitle?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}
