import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService)
    {}

    @Get()
    getAll(){
        return this.employeesService.getAllEmployees()
    }

    @Post()
    addEmployee(@Body() body){
    return this.employeesService.addEmployee(body.name, body.role, body.baseSalary)
    }

    @Get(':id/pay')
    getPay(@Param('id') id: string){
        return this.employeesService.getEmployeePay(Number(id))
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.employeesService.deleteEmployee(Number(id))
    }
}
