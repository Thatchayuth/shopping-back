/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuth(): string {
    return 'This is auth endpoint';
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    console.log(body);
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('validate')
  validate(@Query('token') token: string) {
    return this.authService.validateToken(token);
  }

  @Post('logout')
  logout(@Body() body: { token: string }) {
    return this.authService.logout(body.token);
  }

  @Post('google')
  async googleLogin(@Body() body: { profile: any }) {
    return this.authService.googleLogin(body.profile);
  }

  @Post('facebook')
async facebookLogin(@Body() body: { accessToken: string }) {
  return this.authService.loginWithFacebook(body.accessToken);
}
}

