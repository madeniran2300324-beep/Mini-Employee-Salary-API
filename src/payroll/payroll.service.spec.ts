import { Test, TestingModule } from '@nestjs/testing';
import { PayrollService } from './payroll.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompensationService } from '../compensation/compensation.service';

describe('PayrollService', () => {
  let service: PayrollService;
  let prisma: any;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});