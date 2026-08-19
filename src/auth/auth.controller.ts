import { Controller, Body, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService)
    {}
    @Post('login')
    async login(@Body() body :LoginDto){
        return await this.authService.login(body) 
    }
    @Post('register')
    async register(@Body() body :RegisterDto){
        return await this.authService.register(body)
    }
}