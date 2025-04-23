import { Module } from '@nestjs/common';

import { PostService } from './services/post.service';
import { PostResolver } from './resolvers/post.resolver';
import { PostRepository } from './repositories/post.repository';
import { PostPrismaRepository } from './repositories/post.prisma.repository';

import { TagResolver } from './resolvers/tag.resolver';
import { TagService } from './services/tag.service';
import { TagRepository } from './repositories/tag.repository';
import { TagPrismaRepository } from './repositories/tag.prisma.repository';

import { UserModule } from '../user/user.module';
import { GetPostByIdHandler } from './queries/get-post-by-id/get-post-by-id.handler';
import { GetAllPostsHandler } from './queries/get-all-posts/get-all-posts.handler';
import { CreatePostHandler } from './commands/create-post/create-post.handler';
import { UpdatePostHandler } from './commands/update-post/update-post.handler';
import { RemovePostHandler } from './commands/remove-post/remove-post.handler';
import { AssignTagToPostHandler } from './commands/assign-tag-to-post/assign-tag-to-post.handler';
import { RemoveTagFromPostHandler } from './commands/remove-tag-from-post/remove-tag-from-post.handler';
import { GetAllTagsHandler } from './queries/get-all-tags/get-all-tags.handler';
import { CreateTagHandler } from './commands/create-tag/create-tag.handler';

@Module({
  imports: [UserModule],
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

    // Post - Query
    GetPostByIdHandler,
    GetAllPostsHandler,

    // Post - Command
    CreatePostHandler,
    UpdatePostHandler,
    RemovePostHandler,
    AssignTagToPostHandler,
    RemoveTagFromPostHandler,

    // Tag - Query
    GetAllTagsHandler,

    // Tag - Command
    CreateTagHandler,
  ],
})
export class PostModule {}
