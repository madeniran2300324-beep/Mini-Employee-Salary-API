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
  async findAll(employeeId: string) {
    const compensations = await this.prisma.compensation.findMany({
      where: { employeeId: employeeId },
      orderBy: { effectiveFrom: 'desc' },
    });
    return compensations;
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
}
