import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateCompanyDto, employerId: string) {
    const company = await this.prisma.company.create({
      data: {
        name: data.name,
        description: data.description,
        employerId: employerId,
      },
    });
    return company;
  }
  async findAll(employerId: string) {
    const companies = await this.prisma.company.findMany({
      where: { employerId: employerId },
    });
    return companies;
  }
  async findOne(companyId: string) {
    const company = await this.prisma.company.findUnique({  where: {id: companyId} }) 
    return company;
  }
  async update(companyId: string, data: UpdateCompanyDto){
    const company = await this.prisma.company.update({ where: {id: companyId},  data:{
      name: data.name,
      description: data.description
    }})
    return company;
  }
  async delete(companyId: string){
    const company = await this.prisma.company.delete({ where: {id: companyId} })
    return company;
  }
}
