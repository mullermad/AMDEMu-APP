// nestjs-backend/src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, content: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });
  }

  // Use this for history to ensure you see messages from both sides
  async getChatHistory(userA: string, userB: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          // Case 1: You sent, Friend received
          { senderId: userA, receiverId: userB },
          // Case 2: Friend sent, You received
          { senderId: userB, receiverId: userA },
        ],
      },
      orderBy: {
        createdAt: 'asc', // Oldest first, newest at the bottom
      },
    });
  }
}
