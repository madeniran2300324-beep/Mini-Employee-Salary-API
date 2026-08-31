import { Post, Controller, UseGuards, Param } from '@nestjs/common';
import { CompanyOwnershipGuard } from '../common/guards/company-ownership.guard';
import { PayrollService } from './payroll.service';
@Controller('companies/:companyId/payrolls')
export class PayrollController {
  constructor(private payrollService: PayrollService) {}
  @UseGuards(CompanyOwnershipGuard)
  @Post('run')
  async run(@Param('companyId') companyId: string) {
    return await this.payrollService.run(companyId);
  }
}
