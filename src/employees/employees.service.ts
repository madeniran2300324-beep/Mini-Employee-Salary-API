import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesService {
  private employees: {
    id: number; //properties and types should nenevr be in quotes
    name: string;
    role: string;
    baseSalary: number;
  }[] = []; //this closes a type definition
  private idCounter = 1;

  addEmployee(name: string, role: string, baseSalary: number) {
    const employee = {
      id: this.idCounter,
      name: name,
      role: role,
      baseSalary: baseSalary,
    };
    this.employees.push(employee);
    this.idCounter++;
    return employee;
  }

  getAllEmployees() {
    return this.employees;
  }

  getEmployeePay(id: number) {
    const employee = this.employees.find((emp) => emp.id === id);
    if (!employee) return null;
    const netPay = employee.baseSalary * 0.9;
    return { name: employee.name, netPay };
  }

  deleteEmployee(id: number) {
    this.employees = this.employees.filter((emp) => emp.id !== id);
    return 'Employee deleted';
  }
}
