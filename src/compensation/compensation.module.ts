import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CompensationController } from "./compensation.controller";
import { CompensationService } from "./compensation.service";

@Module({
    controllers: [CompensationController],
    providers: [CompensationService],
    imports: [PrismaModule]
})
export class CompensationModule {}