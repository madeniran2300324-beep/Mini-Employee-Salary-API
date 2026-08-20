import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SkipAuth } from './decorators/skip-auth-decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @SkipAuth()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }
  @SkipAuth()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }
}
