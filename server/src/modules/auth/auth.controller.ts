import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RegisterUserDTO } from '../users/dto/register-user.dto';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { LoginUserDTO } from './dto/login.dto';
import { CookiesService } from '../cookies/cookies.service';
import { AuthGuard } from '../guards/auth.guard';
import { TAuthCookies } from '../cookies/cookies.types';
import type { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseImagePipe } from '../../common/pipes/images.pipe';
import { FilesService } from '../files/files.service';
import { UseUser } from './auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookiesService: CookiesService,
    private filesService: FilesService,
  ) {}

  @HttpCode(204)
  @Post('/register')
  @UseInterceptors(FileInterceptor('avatar', {}))
  async register(
    @Body() userInfo: RegisterUserDTO,
    @Res() res: Response,
    @Req() req: Request,
    @UploadedFile(ParseImagePipe) avatar?: Express.Multer.File,
  ) {
    let avatarUrl: string | undefined;
    if (avatar) {
      avatarUrl = await this.filesService.saveImageFile(avatar, {
        type: 'avatar',
      });
    }
    const { accessToken, refreshToken } = await this.authService.register(
      { ...userInfo, avatarUrl: avatarUrl },
      req.headers['user-agent'],
    );
    this.cookiesService.setAccessTokenCookie(res, accessToken);
    this.cookiesService.setRefreshTokenCookie(res, refreshToken);
    res.end();
  }

  @HttpCode(204)
  @Post('/login')
  async login(
    @Body() loginInfo: LoginUserDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      loginInfo,
      req.headers['user-agent'],
    );
    this.cookiesService.setAccessTokenCookie(res, accessToken);
    this.cookiesService.setRefreshTokenCookie(res, refreshToken);
    res.end();
  }

  @HttpCode(204)
  @Post('/refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies as TAuthCookies;
    const accessToken = await this.authService.refreshToken(
      refreshToken ?? null,
    );
    this.cookiesService.setAccessTokenCookie(res, accessToken);
    res.end();
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@UseUser('sid') sessionId: string, @Res() res: Response) {
    await this.authService.logout(sessionId);
    this.cookiesService.setAccessTokenCookie(res, '', { maxAge: 0 });
    this.cookiesService.setRefreshTokenCookie(res, '', { maxAge: 0 });
    res.end();
  }

  @HttpCode(204)
  @Post('/logout-all')
  @UseGuards(AuthGuard)
  async logoutAll(@UseUser('sub') userId: string, @Res() res: Response) {
    await this.authService.logoutAll(userId);
    this.cookiesService.setAccessTokenCookie(res, '', { maxAge: 0 });
    this.cookiesService.setRefreshTokenCookie(res, '', { maxAge: 0 });
    res.end();
  }
}
