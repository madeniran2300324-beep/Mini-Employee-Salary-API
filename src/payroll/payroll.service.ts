import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompensationService } from '../compensation/compensation.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PayrollService {
  constructor(
    private prisma: PrismaService,
    private compensationService: CompensationService,
  ) {}
  async run(companyId: string) {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const payrollMonth = new Date(Date.UTC(year, month, 1));
    const existingPayroll = await this.prisma.payroll.findUnique({
      where: {
        companyId_payrollMonth: {
          companyId: companyId,
          payrollMonth: payrollMonth,
        },
      },
    });
    if (existingPayroll) {
      if (existingPayroll.status === 'FAILED') {
        await this.prisma.payroll.delete({ where: { id: existingPayroll.id } });
      } else {
        throw new ConflictException(
          'Payroll for this month has already been run.',
        );
      }
    }
    const employees = await this.prisma.employee.findMany({
      where: { companyId: companyId, status: { in: ['ACTIVE', 'ON_LEAVE'] } },
    });
    const paymentRecords: {
      employeeId: string;
      grossAmount: number;
      netAmount: number;
    }[] = [];
    let totalAmount = 0;
    for (const employee of employees) {
      const compensation = await this.compensationService.findActiveForDate(
        employee.id,
        payrollMonth,
      );
      if (!compensation) {
       await this.prisma.payroll.create({
          data:{
          companyId: companyId,
          payrollMonth: payrollMonth,
          status: 'FAILED',
          totalEmployees: 0,
          totalAmount: 0
          }
        });
        
        throw new BadRequestException(
          `Employee ${employee.id} has no compensation record`,
        );
      }
      const paymentRecord = {
        employeeId: employee.id,
        grossAmount: Number(compensation.salary),
        netAmount: Number(compensation.salary),
      };
      paymentRecords.push(paymentRecord);
      totalAmount = totalAmount + Number(compensation.salary);
    }
    const payroll = await this.prisma.payroll.create({
      data: {
        companyId: companyId,
        payrollMonth: payrollMonth,
        totalEmployees: employees.length,
        totalAmount: totalAmount,
        status: 'COMPLETED',
        processedAt: new Date(),
      },
    });
    const finalPaymentRecords = paymentRecords.map((record) => ({
      employeeId: record.employeeId,
      grossAmount: record.grossAmount,
      netAmount: record.netAmount,
      payrollId: payroll.id,
      paymentStatus: PaymentStatus.PAID,
      paymentDate: new Date(),
    }));
    await this.prisma.paymentRecord.createMany({ data: finalPaymentRecords });
    return payroll;
  }
  async findAll(companyId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const payrolls = await this.prisma.payroll.findMany({
      where: { companyId: companyId },
      skip: skip,
      take: limit,
      orderBy: { payrollMonth: 'desc' },
    });
    const total = await this.prisma.payroll.count({
      where: { companyId: companyId },
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data: payrolls,
      meta: { page: page, limit: limit, total: total, totalPages: totalPages },
    };
  }
  async findOne(payrollId: string) {
    const payroll = await this.prisma.payroll.findUnique({
      where: { id: payrollId },
    });
    return payroll;
  }
  async findPayments(payrollId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const paymentRecords = await this.prisma.paymentRecord.findMany({
      where: { payrollId: payrollId },
      skip: skip,
      take: limit,
    });
    const total = await this.prisma.paymentRecord.count({
      where: { payrollId: payrollId },
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data: paymentRecords,
      meta: { page: page, limit: limit, total: total, totalPages: totalPages },
    };
  }
}
