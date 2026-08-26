import {
  Body,
  Controller,
  Post,
  Param,
  UseGuards,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CompensationService } from './compensation.service';
import { CreateCompensationDto } from './dto/create-compensation.dto';
import { UpdateCompensationDto } from './dto/update-compensation.dto';
import { CompensationOwnershipGuard } from '../common/guards/compensation-ownership.guard';
import { EmployeeOwnershipGuard } from '../common/guards/employee-ownership.guard';
import { CompanyOwnershipGuard } from '../common/guards/company-ownership.guard';

@Controller('companies/:companyId/employees/:employeeId/compensation')
export class CompensationController {
  constructor(private compensationService: CompensationService) {}
  @UseGuards(CompanyOwnershipGuard, EmployeeOwnershipGuard)
  @Post()
  async create(
    @Param('employeeId') employeeId: string,
    @Param('companyId') companyId: string,
    @Body() data: CreateCompensationDto,
  ) {
    return await this.compensationService.create(data, employeeId);
  }
  @UseGuards(CompanyOwnershipGuard, EmployeeOwnershipGuard)
  @Get()
  async findAll(
    @Param('employeeId') employeeId: string,
    @Param('companyId') companyId: string,
  ) {
    return await this.compensationService.findAll(employeeId);
  }
  @UseGuards(
    CompanyOwnershipGuard,
    EmployeeOwnershipGuard,
    CompensationOwnershipGuard,
  )
  @Patch(':compensationId')
  async update(
    @Param('employeeId') employeeId: string,
    @Param('compensationId') compensationId: string,
    @Param('companyId') companyId: string,
    @Body() data: UpdateCompensationDto,
  ) {
    return await this.compensationService.update(compensationId, data);
  }
  @UseGuards(CompanyOwnershipGuard, EmployeeOwnershipGuard, CompensationOwnershipGuard)
  @Delete(':compensationId')
  async delete(
    @Param('employeeId') employeeId: string,
    @Param('compensationId') compensationId: string,
    @Param('companyId') companyId: string
  ) {
    return await this.compensationService.delete(compensationId);
  }
}
