import { Test, TestingModule } from '@nestjs/testing';
import { CompensationService } from './compensation.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CompensationService', () => {
  let service: CompensationService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      compensation: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompensationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CompensationService>(CompensationService);
    prisma = mockPrisma;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() passes correct data to prisma', async () => {
    const dto = {
      salary: 500000,
      salaryFrequency: 'MONTHLY',
      effectiveFrom: new Date('2026-09-01T00:00:00.000Z'),
    };
    prisma.compensation.create.mockResolvedValue({ id: 'c1', ...dto });

    await service.create(dto as any, 'employee-1');

    expect(prisma.compensation.create).toHaveBeenCalledWith({
      data: { ...dto, employeeId: 'employee-1' },
    });
  });

  it('findAll() orders by effectiveFrom desc and paginates', async () => {
    prisma.compensation.findMany.mockResolvedValue([{ id: 'c1' }]);
    prisma.compensation.count.mockResolvedValue(1);

    const result = await service.findAll('employee-1', 1, 20);

    expect(prisma.compensation.findMany).toHaveBeenCalledWith({
      where: { employeeId: 'employee-1' },
      orderBy: { effectiveFrom: 'desc' },
      skip: 0,
      take: 20,
    });
    expect(result.meta.total).toBe(1);
  });

  it('update() passes correct data to prisma', async () => {
    const dto = { salary: 600000 };
    prisma.compensation.update.mockResolvedValue({ id: 'c1', salary: 600000 });

    await service.update('c1', dto as any);

    expect(prisma.compensation.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { salary: 600000, salaryFrequency: undefined, effectiveFrom: undefined },
    });
  });

  it('delete() removes the compensation by id', async () => {
    prisma.compensation.delete.mockResolvedValue({ id: 'c1' });

    await service.delete('c1');

    expect(prisma.compensation.delete).toHaveBeenCalledWith({
      where: { id: 'c1' },
    });
  });

  it('findActiveForDate() filters by employeeId and effectiveFrom <= targetDate, most recent first', async () => {
    const targetDate = new Date('2026-09-18T00:00:00.000Z');
    prisma.compensation.findFirst.mockResolvedValue({ id: 'c1', salary: 500000 });

    const result = await service.findActiveForDate('employee-1', targetDate);

    expect(prisma.compensation.findFirst).toHaveBeenCalledWith({
      where: { employeeId: 'employee-1', effectiveFrom: { lte: targetDate } },
      orderBy: { effectiveFrom: 'desc' },
    });
    expect(result.salary).toBe(500000);
  });

  it('findActiveForDate() returns null when no compensation is active yet', async () => {
    prisma.compensation.findFirst.mockResolvedValue(null);

    const result = await service.findActiveForDate('employee-1', new Date());

    expect(result).toBeNull();
  });
});