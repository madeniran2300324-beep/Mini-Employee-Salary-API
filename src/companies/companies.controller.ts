import { Body, Controller, Post, Req, Get } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import type { Request } from 'express';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Post()
  async create(@Body() data: CreateCompanyDto, @Req() req: Request) {
    return await this.companiesService.create(data, req.user.sub);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return await this.companiesService.findAll(req.user.sub);
  }
}
