import { Injectable, CanActivate, ExecutionContext, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class EmployeeOwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const companyId = request.params.companyId;
    const employeeId = request.params.employeeId; 
    const employee = await this.prisma.employee.findUnique({
      where: { companyId: companyId, id: employeeId },
    }); 
    if (!employee) {
        throw new NotFoundException();
    }
    return true;
  }
}