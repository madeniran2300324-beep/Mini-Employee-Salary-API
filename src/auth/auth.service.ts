import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async register(data : RegisterDto){
        const existingEmployer = await this.prisma.employer.findUnique({ where: { email: data.email } });
        if (existingEmployer){
            throw new ConflictException('Email already in use.');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const employer = await this.prisma.employer.create({ data: { firstName:data.firstName, lastName: data.lastName, email:data.email, passwordHash:hashedPassword}});
        const { passwordHash, ...result } = employer;
        return result
        
    }
}

