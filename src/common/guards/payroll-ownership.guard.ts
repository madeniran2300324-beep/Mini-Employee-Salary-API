import { CanActivate, Injectable, ExecutionContext, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PayrollOwnershipGuard implements CanActivate {
    constructor(private prisma: PrismaService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
                const companyId = request.params.companyId;
                const payrollId = await this.prisma.payroll.findUnique({
                    where: { payrollId: payroll, id: companyId },
                });
                if (!payrollId) {
                    throw new NotFoundException();
                }
                return true;
    }
}