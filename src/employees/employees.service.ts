import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateEmployeeDto, companyId: string) {
    const employee = await this.prisma.employee.create({ 
      data: { 
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        employeeNumber: data.employeeNumber,
        jobTitle: data.jobTitle,
        companyId: companyId
      }
    });
    return employee;
  }
  async findAll(companyId: string) {
    const employees = await this.prisma.employee.findMany({ where: {companyId: companyId, status: { in: ['ACTIVE', 'ON_LEAVE'] } } })
    return employees;
  }
  async findOne(employeeId: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id: employeeId } })
    return employee;
  }
  async update(employeeId: string, data: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.update({ where: { id: employeeId}, 
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        employeeNumber: data.employeeNumber,
        jobTitle: data.jobTitle,
        status: data.status
      }
    });
    return employee;
  }
  async delete(employeeId: string){
    const employee = await this.prisma.employee.delete({ where: {id: employeeId } })
    return employee;
  }

}
