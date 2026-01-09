import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { BetterAuthGuard } from 'src/auth/auth.guard';

@Controller('chat')
@UseGuards(BetterAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('history/:friendId')
  async getHistory(@Param('friendId') friendId: string, @Req() req: any) {
    return this.chatService.getChatHistory(req.user.id, friendId);
  }
}
