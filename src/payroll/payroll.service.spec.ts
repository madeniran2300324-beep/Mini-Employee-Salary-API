import { Test, TestingModule } from '@nestjs/testing';
import { PayrollService } from './payroll.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompensationService } from '../compensation/compensation.service';

describe('PayrollService', () => {
  let service: PayrollService;
  let prisma: any;
  let compensationService: any;

  beforeEach(async () => {
    const mockPrisma = {
      payroll: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      employee: {
        findMany: jest.fn(),
      },
      company: {
        findMany: jest.fn(),
      },
      paymentRecord: {
        createMany: jest.fn(),
      },
    };

    const mockCompensationService = {
      findActiveForDate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CompensationService, useValue: mockCompensationService },
      ],
    }).compile();

    service = module.get<PayrollService>(PayrollService);
    prisma = mockPrisma;
    compensationService = mockCompensationService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws ConflictException when payroll already COMPLETED', async () => {
    prisma.payroll.findUnique.mockResolvedValue({
      id: 'existing-id',
      status: 'COMPLETED',
    });

    await expect(service.run('some-company-id')).rejects.toThrow(
      'Payroll for this month has already been run.',
    );

    expect(prisma.employee.findMany).not.toHaveBeenCalled();
  });

  it('deletes old FAILED payroll and completes a fresh run', async () => {
    prisma.payroll.findUnique.mockResolvedValue({
      id: 'old-failed-id',
      status: 'FAILED',
    });
    prisma.employee.findMany.mockResolvedValue([
      { id: 'employee-1', companyId: 'some-company-id' },
    ]);
    compensationService.findActiveForDate.mockResolvedValue({
      salary: 500000,
    });
    prisma.payroll.create.mockResolvedValue({
      id: 'new-payroll-id',
      status: 'COMPLETED',
    });

    const result = await service.run('some-company-id');

    expect(prisma.payroll.delete).toHaveBeenCalledWith({
      where: { id: 'old-failed-id' },
    });
    expect(result.status).toBe('COMPLETED');
    expect(prisma.paymentRecord.createMany).toHaveBeenCalled();
  });
  it('creates FAILED payroll and throws when employee has no compensation', async () => {
    prisma.payroll.findUnique.mockResolvedValue(null);
    prisma.employee.findMany.mockResolvedValue([
      { id: 'employee-without-comp', companyId: 'some-company-id' },
    ]);
    compensationService.findActiveForDate.mockResolvedValue(null);

    await expect(service.run('some-company-id')).rejects.toThrow(
      'Employee employee-without-comp has no compensation record',
    );

    expect(prisma.payroll.create).toHaveBeenCalledWith({
      data: {
        companyId: 'some-company-id',
        payrollMonth: expect.any(Date),
        status: 'FAILED',
        totalEmployees: 0,
        totalAmount: 0,
      },
    });
  });
});
