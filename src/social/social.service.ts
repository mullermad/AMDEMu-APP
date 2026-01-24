import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  // 1. Send a Friend Request
  async sendFriendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException(
        'You cannot send a friend request to yourself.',
      );
    }

    // Check if a request already exists
    const existing = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      throw new BadRequestException(
        'A friendship or request already exists between these users.',
      );
    }

    return this.prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING',
      },
    });
  }

  // 2. Accept a Friend Request
  async acceptRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new NotFoundException('Request not found.');
    if (request.receiverId !== userId) {
      throw new BadRequestException('This request was not sent to you.');
    }

    return this.prisma.friendship.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });
  }

  // 3. Get Friends List
  // nestjs-backend/src/social/social.service.ts

  async getFriends(userId: string) {
    return this.prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        sender: true, // Critical
        receiver: true, // Critical
      },
    });
  }

  async getPendingRequests(userId: string) {
    return this.prisma.friendship.findMany({
      where: {
        receiverId: userId, // Requests sent TO me
        status: 'PENDING',
      },
      include: {
        sender: true, // Show who is asking to be my friend
      },
    });
  }
}
