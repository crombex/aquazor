import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import type { Request } from 'express';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  async getUserOwnData(@Req() req: Request) {
    const userId = req.user.sub;
    return await this.usersService.findOneById(userId, {includeSensitiveData: false});
  }
}
