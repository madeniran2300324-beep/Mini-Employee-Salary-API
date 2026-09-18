import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PayrollService } from './payroll/payroll.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private payrollService: PayrollService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test-run-all')
  async testRunAll() {
    return await this.payrollService.runAllCompanies();
  }
}
