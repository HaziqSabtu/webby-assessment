import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostResolver } from './resolvers/post.resolver';
import { PostRepository } from './repositories/post.repository';
import { PostPrismaRepository } from './repositories/post.prisma.repository';

@Module({
  providers: [
    PostResolver,
    PostService,
    {
      provide: PostRepository,
      useClass: PostPrismaRepository,
    },
  ],
})
export class PostModule {}
