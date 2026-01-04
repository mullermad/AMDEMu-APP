import { Injectable, UnauthorizedException } from '@nestjs/common';
import { auth } from './better-auth.config';
import { Request } from 'express';

@Injectable()
export class AuthService {
  /**
   * Validates a user session from the request headers/cookies
   */
  async getSession(req: Request) {
    // 1. Convert Express headers to Web API Headers
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else if (value) {
        headers.set(key, value);
      }
    });

    // 2. Pass the converted headers to Better Auth
    const session = await auth.api.getSession({
      headers: headers,
    });

    if (!session) {
      throw new UnauthorizedException('Not logged in');
    }

    return session;
  }

  /**
   * Helper to get the logged-in user directly
   */
  async getAuthenticatedUser(req: Request) {
    const session = await this.getSession(req);
    return session.user;
  }
}
