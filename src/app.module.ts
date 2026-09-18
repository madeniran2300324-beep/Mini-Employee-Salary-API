import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { CompensationModule } from './compensation/compensation.module';
import { PayrollModule } from './payroll/payroll.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [CompensationModule, EmployeesModule, PrismaModule, AuthModule, CompaniesModule, PayrollModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
