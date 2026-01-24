// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller'; // Import it
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module'; // Required for Guard

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ChatController], // <--- MAKE SURE THIS IS HERE
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
