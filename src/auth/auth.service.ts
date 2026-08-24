import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(data: RegisterDto) {
    const existingEmployer = await this.prisma.employer.findUnique({
      where: { email: data.email },
    });
    if (existingEmployer) {
      throw new ConflictException('Email already in use.');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const employer = await this.prisma.employer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: hashedPassword,
      },
    });
    const { passwordHash, ...result } = employer;
    return result;
  }
  async login(data: LoginDto) {
    const employer = await this.prisma.employer.findUnique({
      where: { email: data.email },
    });
    if (!employer) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      data.password,
      employer.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload = { sub: employer.id };
    const token = this.jwt.sign(payload);
    return { access_token: token };
  }
}
