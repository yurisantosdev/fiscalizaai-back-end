/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Controller, Post, Request } from '@nestjs/common';
import { LoginType } from 'src/types/LoginType';
import { AuthService } from '../services/app.auth.service';

@Controller()
export class AuthController {
  // eslint-disable-next-line prettier/prettier
  constructor(private authService: AuthService) { }

  @Post('auth')
  async login(@Request() @Body() Body: LoginType) {
    const { email, senha } = Body;

    return this.authService.login(email, senha);
  }
}
