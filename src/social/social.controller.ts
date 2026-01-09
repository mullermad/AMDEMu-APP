import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { BetterAuthGuard } from 'src/auth/auth.guard';

@Controller('social')
@UseGuards(BetterAuthGuard) // Global guard for all social routes
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // POST /social/request/cl... (Target User ID)
  @Post('request/:id')
  sendRequest(@Param('id') receiverId: string, @Req() req: any) {
    return this.socialService.sendFriendRequest(req.user.id, receiverId);
  }

  // POST /social/accept/cl... (Friendship ID)
  @Post('accept/:id')
  accept(@Param('id') requestId: string, @Req() req: any) {
    return this.socialService.acceptRequest(requestId, req.user.id);
  }

  // GET /social/friends
  @Get('friends')
  getFriends(@Req() req: any) {
    return this.socialService.getFriends(req.user.id);
  }

  // GET /social/requests/pending
  @Get('requests/pending')
  getPending(@Req() req: any) {
    return this.socialService.getPendingRequests(req.user.id);
  }
}
