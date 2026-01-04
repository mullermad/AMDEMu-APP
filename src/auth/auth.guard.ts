import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class BetterAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      // Use the getSession logic we wrote in the service
      const session = await this.authService.getSession(request);

      // Attach the user to the request so controllers can use it
      request.user = session.user;
      request.session = session.session;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Please log in to access this resource');
    }
  }
}
