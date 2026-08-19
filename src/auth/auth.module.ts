import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard'; 
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION as any },
    }),
  ],
  controllers: [AuthController],
  providers: [{
      provide: APP_GUARD,
      useClass: AuthGuard,
    } ,AuthService],
})
export class AuthModule {}
