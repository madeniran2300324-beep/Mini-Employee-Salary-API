import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import type { Request } from 'express';
import { CompanyOwnershipGuard } from '../common/guards/company-ownership.guard';
import { UpdateCompanyDto } from './dto/update-company.dto';

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

  @UseGuards(CompanyOwnershipGuard)
  @Get(':companyId')
  async findOne(@Param('companyId') companyId: string) {
    return await this.companiesService.findOne(companyId);
  }

  @Patch(':companyId')
  @UseGuards(CompanyOwnershipGuard)
  async update(
    @Param('companyId') companyId: string,
    @Body() data: UpdateCompanyDto,
  ) {
    return await this.companiesService.update(companyId, data);
  }

  @UseGuards(CompanyOwnershipGuard)
  @Delete(':companyId')
  async delete(@Param('companyId') companyId: string) {
    return await this.companiesService.delete(companyId);
  }
}
