import { Get, Post, Controller, UseGuards, Param, Query } from '@nestjs/common';
import { CompanyOwnershipGuard } from '../common/guards/company-ownership.guard';
import { PayrollService } from './payroll.service';
import { PayrollOwnershipGuard } from '../common/guards/payroll-ownership.guard';
@Controller('companies/:companyId/payrolls')
export class PayrollController {
  constructor(private payrollService: PayrollService) {}
  @UseGuards(CompanyOwnershipGuard)
  @Post('run')
  async run(@Param('companyId') companyId: string) {
    return await this.payrollService.run(companyId);
  }
  @UseGuards(CompanyOwnershipGuard)
  @Get()
  async findAll(
    @Param('companyId') companyId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    return await this.payrollService.findAll(
      companyId,
      pageNumber,
      limitNumber,
    );
  }
  @UseGuards(CompanyOwnershipGuard, PayrollOwnershipGuard)
  @Get(':payrollId')
  async findOne(
    @Param('companyId') companyId: string,
    @Param('payrollId') payrollId: string,
  ) {
    return await this.payrollService.findOne(payrollId);
  }
  @UseGuards(CompanyOwnershipGuard, PayrollOwnershipGuard)
  @Get(':payrollId/payments')
  async findPayments(
    @Param('companyId') companyId: string,
    @Param('payrollId') payrollId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    return await this.payrollService.findPayments(
      payrollId,
      pageNumber,
      limitNumber,
    );
  }
}
