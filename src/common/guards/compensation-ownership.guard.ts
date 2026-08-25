import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CompensationOwnershipGuard implements CanActivate {
    constructor(private prisma: PrismaService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const compensationId = request.params.compensationId;
        const employeeId = request.params.employeeId;
        const compensation = await this.prisma.compensation.findUnique({
            where: { employeeId: employeeId, id: compensationId },
        });
        if (!compensation) {
            throw new NotFoundException();
        }
        return true;
    }
}