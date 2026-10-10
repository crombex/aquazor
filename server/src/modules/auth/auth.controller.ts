import { Controller, Post, Body, Req, Res, HttpCode, UseGuards } from '@nestjs/common';
import { RegisterUserDTO } from '../users/dto/register-user.dto';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { LoginUserDTO } from './dto/login.dto';
import { CookiesService } from '../cookies/cookies.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: CookiesService,
  ) {}

  @HttpCode(204)
  @Post('/register')
  async register(
    @Body() userInfo: RegisterUserDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(
      userInfo,
      req.headers['user-agent'],
    );
    this.cookieService.setAccessTokenCookie(res, accessToken);
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    res.end()
  }

  @HttpCode(204)
  @Post('/login')
  async login(@Body() loginInfo: LoginUserDTO, @Res() res: Response, @Req() req: Request) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginInfo, req.headers['user-agent'] ?? '');
    this.cookieService.setAccessTokenCookie(res, accessToken);
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    res.end()
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Post('/refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const accessToken = await this.authService.refreshToken(req.user!);
    this.cookieService.setAccessTokenCookie(res, accessToken)
    res.end()
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req.user!.sub, req.headers['user-agent'] ?? '');
    this.cookieService.setAccessTokenCookie(res, '', {maxAge: 0})
    this.cookieService.setRefreshTokenCookie(res, '', {maxAge: 0})
    res.end()
  }

  @HttpCode(204)
  @Post('/logout-all')
  @UseGuards(AuthGuard)
  async logoutAll(@Req() req: Request, @Res() res: Response) {
    await this.authService.logoutAll(req.user!.sub)
    this.cookieService.setAccessTokenCookie(res, '', {maxAge: 0})
    this.cookieService.setRefreshTokenCookie(res, '', {maxAge: 0})
    res.end()
  }
}
