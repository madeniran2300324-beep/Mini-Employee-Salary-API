import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      company: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prisma = mockPrisma;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() passes correct data to prisma', async () => {
    const dto = { name: 'Acme', description: 'A company' };
    prisma.company.create.mockResolvedValue({ id: 'c1', ...dto });

    await service.create(dto as any, 'employer-1');

    expect(prisma.company.create).toHaveBeenCalledWith({
      data: { ...dto, employerId: 'employer-1' },
    });
  });

  it('findAll() filters by employerId', async () => {
    prisma.company.findMany.mockResolvedValue([{ id: 'c1' }]);

    const result = await service.findAll('employer-1');

    expect(prisma.company.findMany).toHaveBeenCalledWith({
      where: { employerId: 'employer-1' },
    });
    expect(result).toEqual([{ id: 'c1' }]);
  });

  it('findOne() returns the company by id', async () => {
    prisma.company.findUnique.mockResolvedValue({ id: 'c1' });

    const result = await service.findOne('c1');

    expect(prisma.company.findUnique).toHaveBeenCalledWith({
      where: { id: 'c1' },
    });
    expect(result).toEqual({ id: 'c1' });
  });

  it('update() passes correct data to prisma', async () => {
    const dto = { name: 'Updated Name' };
    prisma.company.update.mockResolvedValue({ id: 'c1', name: 'Updated Name' });

    await service.update('c1', dto as any);

    expect(prisma.company.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { name: 'Updated Name', description: undefined },
    });
  });

  it('delete() removes the company by id', async () => {
    prisma.company.delete.mockResolvedValue({ id: 'c1' });

    await service.delete('c1');

    expect(prisma.company.delete).toHaveBeenCalledWith({
      where: { id: 'c1' },
    });
  });
});