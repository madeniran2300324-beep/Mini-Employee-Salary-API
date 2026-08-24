import { EmployeeStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  employeeNumber?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}
