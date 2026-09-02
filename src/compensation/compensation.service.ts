import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompensationDto } from './dto/create-compensation.dto';
import { UpdateCompensationDto } from './dto/update-compensation.dto';

@Injectable()
export class CompensationService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateCompensationDto, employeeId: string) {
    const compensation = await this.prisma.compensation.create({
      data: {
        salary: data.salary,
        salaryFrequency: data.salaryFrequency,
        effectiveFrom: data.effectiveFrom,
        employeeId: employeeId,
      },
    });
    return compensation;
  }
  async findAll(employeeId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const compensations = await this.prisma.compensation.findMany({
      where: { employeeId: employeeId },
      orderBy: { effectiveFrom: 'desc' },
      skip: skip,
      take: limit,
    });
    const total = await this.prisma.compensation.count({
      where: { employeeId: employeeId },
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data: compensations,
      meta: { page: page, limit: limit, total: total, totalPages: totalPages },
    };
  }
  async update(compensationId: string, data: UpdateCompensationDto) {
    const compensation = await this.prisma.compensation.update({
      where: { id: compensationId },
      data: {
        salary: data.salary,
        salaryFrequency: data.salaryFrequency,
        effectiveFrom: data.effectiveFrom,
      },
    });
    return compensation;
  }
  async delete(compensationId: string) {
    const compensation = await this.prisma.compensation.delete({
      where: { id: compensationId },
    });
    return compensation;
  }
  async findActiveForDate(employeeId: string, targetDate: Date) {
    const compensation = await this.prisma.compensation.findFirst({
      where: { employeeId: employeeId, effectiveFrom: { lte: targetDate } },
      orderBy: { effectiveFrom: 'desc' },
    });
    return compensation;
  }
}
