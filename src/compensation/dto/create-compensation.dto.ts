import { SalaryFrequency } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  Matches,
} from 'class-validator';

export class CreateCompensationDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(70000)
  salary!: number;

  @IsNotEmpty()
  @IsEnum(SalaryFrequency)
  salaryFrequency!: SalaryFrequency;

  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
    message:
      'effectiveFrom must be a full ISO-8601 datetime, e.g. 2026-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  effectiveFrom!: Date;
}
