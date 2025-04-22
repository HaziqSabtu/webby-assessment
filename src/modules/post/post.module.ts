import { Module } from '@nestjs/common';

import { PostService } from './services/post.service';
import { PostResolver } from './resolvers/post.resolver';
import { PostRepository } from './repositories/post.repository';
import { PostPrismaRepository } from './repositories/post.prisma.repository';

import { TagResolver } from './resolvers/tag.resolver';
import { TagService } from './services/tag.service';
import { TagRepository } from './repositories/tag.repository';
import { TagPrismaRepository } from './repositories/tag.prisma.repository';

@Module({
  providers: [
    PostResolver,
    PostService,
    {
      provide: PostRepository,
      useClass: PostPrismaRepository,
    },
    TagResolver,
    TagService,
    {
      provide: TagRepository,
      useClass: TagPrismaRepository,
    },
  ],
})
export class PostModule {}
