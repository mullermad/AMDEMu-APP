import { All, Controller, Req, Res } from '@nestjs/common';
import express from 'express';
import { auth } from './better-auth.config';
import { toNodeHandler } from 'better-auth/node';

@Controller('api/auth')
export class AuthController {
  @All('*')
  async handleAuth(@Req() req: express.Request, @Res() res: express.Response) {
    // toNodeHandler bridges the gap between NestJS(Express) and Better Auth(Web API)
    return toNodeHandler(auth)(req, res);
  }
}
