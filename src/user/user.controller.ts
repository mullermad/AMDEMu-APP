import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import express from 'express';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { BetterAuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  @UseGuards(BetterAuthGuard) // <--- Only logged-in users can enter
  async getProfile(@Req() req: express.Request) {
    // 1. Use the session logic we built in AuthService
    const session = await this.authService.getSession(req);

    // 2. Return the user profile from the database
    return this.userService.findOne(session.user.id);
  }

  @Get()
  @UseGuards(BetterAuthGuard) // <--- Only logged-in users can enter
  async getAllUsers() {
    return this.userService.findAll();
  }
}
