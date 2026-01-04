import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Find a user for profile display
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      // Include profile fields only
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Find all users (e.g., to find friends)
  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, image: true },
    });
  }
}
