import {
  CanActivate,
  Injectable,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PayrollOwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const companyId = request.params.companyId;
    const payrollId = request.params.payrollId;
    const payroll = await this.prisma.payroll.findUnique({
      where: { id: payrollId, companyId: companyId},
    });
    if (!payroll) {
      throw new NotFoundException();
    }
    return true;
  }
}
