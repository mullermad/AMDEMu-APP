import { Controller, Post, Get, Body, UseGuards, Req, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { BetterAuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 1. Create a post (Protected)
  @Post()
  @UseGuards(BetterAuthGuard) // Only logged-in users can post
  async create(
    @Body() body: { content: string; image?: string },
    @Req() req: any, // We get the user from the Request (attached by your Guard)
  ) {
    const userId = req.user.id;
    return this.postService.createPost(userId, body.content, body.image);
  }

  // 2. Get the feed (Public - anyone can see posts)
  @Get()
  async findAll() {
    return this.postService.getFeed();
  }

  @Post(':id/like') // This creates the URL: /posts/<ID>/like
  @UseGuards(BetterAuthGuard)
  async like(@Param('id') postId: string, @Req() req: any) {
    // req.user is attached by your BetterAuthGuard
    return this.postService.toggleLike(req.user.id, postId);
  }
  @Post(':id/comment')
  @UseGuards(BetterAuthGuard)
  async createComment(
    @Param('id') postId: string,
    @Body() body: { content: string },
    @Req() req: any,
  ) {
    return this.postService.addComment(req.user.id, postId, body.content);
  }
}
