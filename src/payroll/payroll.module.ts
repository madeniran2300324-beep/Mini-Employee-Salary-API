import { Module } from '@nestjs/common';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CompensationModule } from '../compensation/compensation.module';

@Module({
  controllers: [PayrollController],
  providers: [PayrollService],
  imports: [PrismaModule, CompensationModule],
  exports: [PayrollService]
})
export class PayrollModule {}
