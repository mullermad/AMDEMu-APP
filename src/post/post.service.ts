import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // Create a new post linked to the logged-in user
  async createPost(userId: string, content: string, image?: string) {
    return this.prisma.post.create({
      data: {
        content,
        image,
        authorId: userId, // This links the post to the user
      },
    });
  }

  // Add this method to PostService
  async addComment(userId: string, postId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      include: {
        author: { select: { name: true, image: true } },
      },
    });
  }

  // Update your getFeed method to include comments
  async getFeed() {
    return this.prisma.post.findMany({
      include: {
        author: { select: { name: true, image: true } },
        _count: { select: { likes: true, comments: true } }, // Count comments too
        comments: {
          take: 3, // Only show the last 3 comments in the feed
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleLike(userId: string, postId: string) {
    // 1. Check if the post actually exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Post not found');

    // 2. Check if the user has already liked this post
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    // 3. If it exists, DELETE it (Unlike)
    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { liked: false };
    }

    // 4. If it doesn't exist, CREATE it (Like)
    await this.prisma.like.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
    return { liked: true };
  }
}
