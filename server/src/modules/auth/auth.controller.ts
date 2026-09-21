import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/signup')
  registerUser() {

  }

  @Post('/signin')
  loginUser() {

  }

  @Post('/refresh-token')
  updateRefreshToken() {

  }
}
