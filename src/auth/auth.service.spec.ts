import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  beforeEach(async () => {
    const mockPrisma = {
      employer: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    const mockJwt = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = mockPrisma;
    jwt = mockJwt;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register() throws ConflictException if email already in use', async () => {
    prisma.employer.findUnique.mockResolvedValue({ id: 'existing' });

    await expect(
      service.register({ email: 'taken@example.com' } as any),
    ).rejects.toThrow('Email already in use.');

    expect(prisma.employer.create).not.toHaveBeenCalled();
  });

  it('register() hashes password and strips passwordHash from result', async () => {
    prisma.employer.findUnique.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    prisma.employer.create.mockResolvedValue({
      id: 'new-id',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      passwordHash: 'hashed-password',
    });

    const result = await service.register({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'plaintext',
    } as any);

    expect(bcrypt.hash).toHaveBeenCalledWith('plaintext', 10);
    expect(result).not.toHaveProperty('passwordHash');
    expect(result.email).toBe('ada@example.com');
  });

  it('login() throws UnauthorizedException if employer not found', async () => {
    prisma.employer.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'nobody@example.com', password: 'x' } as any),
    ).rejects.toThrow('Invalid Credentials');
  });

  it('login() throws UnauthorizedException if password is wrong', async () => {
    prisma.employer.findUnique.mockResolvedValue({
      id: 'e1',
      passwordHash: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'ada@example.com', password: 'wrong' } as any),
    ).rejects.toThrow('Invalid Credentials');
  });

  it('login() returns an access_token on valid credentials', async () => {
    prisma.employer.findUnique.mockResolvedValue({
      id: 'e1',
      passwordHash: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwt.sign.mockReturnValue('signed-jwt-token');

    const result = await service.login({
      email: 'ada@example.com',
      password: 'correct',
    } as any);

    expect(jwt.sign).toHaveBeenCalledWith({ sub: 'e1' });
    expect(result).toEqual({ access_token: 'signed-jwt-token' });
  });
});