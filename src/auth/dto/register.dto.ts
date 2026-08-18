import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string

  @IsString()
  @IsNotEmpty()
  lastName!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8, {message: 'Password must be a minimum of 8 characters'})
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {message: 'Password must contain at least one letter, one number, and one special character'})
  password!: string
}
