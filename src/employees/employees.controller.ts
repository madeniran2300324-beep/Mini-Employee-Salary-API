import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  Param,
  Patch,
  UseGuards,
  Delete
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CompanyOwnershipGuard } from '../common/guards/company-ownership.guard';
import { EmployeeOwnershipGuard } from '../common/guards/employee-ownership.guard';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('companies/:companyId/employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @UseGuards(CompanyOwnershipGuard)
  @Post()
  async create(
    @Param('companyId') companyId: string,
    @Body() data: CreateEmployeeDto,
  ) {
    return await this.employeesService.create(data, companyId);
  }
  @UseGuards(CompanyOwnershipGuard)
  @Get()
  async findAll(@Param('companyId') companyId: string) {
    return await this.employeesService.findAll(companyId);
  }
  @UseGuards(CompanyOwnershipGuard, EmployeeOwnershipGuard)
  @Get(':employeeId')
  async findOne(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return await this.employeesService.findOne(employeeId);
  }
  @UseGuards(CompanyOwnershipGuard, EmployeeOwnershipGuard)
  @Patch(':employeeId')
  async update(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
    @Body() data: UpdateEmployeeDto,
  ) {
    return await this.employeesService.update(employeeId, data);
  }
  @UseGuards(CompanyOwnershipGuard, EmployeeOwnershipGuard)
  @Delete(':employeeId')
  async delete(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return await this.employeesService.delete(employeeId);
  }
}
