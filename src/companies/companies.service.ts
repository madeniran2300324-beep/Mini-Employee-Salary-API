import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCompanyDto } from "./dto/create-company.dto";

@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaService) {}
    async create(data: CreateCompanyDto, employerId: string ){
        const company = await this.prisma.company.create({ data: {name: data.name, description: data.description, employerId: employerId } });
        return company;
}
}