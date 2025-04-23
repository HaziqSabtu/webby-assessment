import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostInput } from '../dto/create-post.input';
import { FindAllPostInput } from '../dto/findAll-post.input';
import { UpdatePostInput } from '../dto/update-post.input';
import { RemovePostInput } from '../dto/remove-post.input';
import { AssignTagInput } from '../dto/assign-tag.input';
import { RemoveTagInput } from '../dto/remove-tag.input';
import { Post } from '../entities/post.entity';
import { PostPagination } from '../entities/post-pagination.entity';
import { GetPostByIdQuery } from '../queries/get-post-by-id/get-post-by-id.query';
import { GetAllPostsQuery } from '../queries/get-all-posts/get-all-posts.query';
import { CreatePostCommand } from '../commands/create-post/create-post.command';
import { UpdatePostCommand } from '../commands/update-post/update-post.command';
import { RemovePostCommand } from '../commands/remove-post/remove-post.command';
import { AssignTagToPostCommand } from '../commands/assign-tag-to-post/assign-tag-to-post.command';
import { RemoveTagFromPostCommand } from '../commands/remove-tag-from-post/remove-tag-from-post.command';

@Injectable()
export class PostService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async create(
    createPostInput: CreatePostInput & { userId: string },
  ): Promise<Post> {
    return await this.commandBus.execute<CreatePostCommand, Post>(
      new CreatePostCommand({
        ...createPostInput,
        authorId: createPostInput.userId,
      }),
    );
  }

  async findAll(
    findAllPostInput: FindAllPostInput | undefined,
  ): Promise<PostPagination> {
    return await this.queryBus.execute<GetAllPostsQuery, PostPagination>(
      new GetAllPostsQuery(findAllPostInput || {}),
    );
  }

  async findOneOrFail(id: string): Promise<Post> {
    return await this.queryBus.execute<GetPostByIdQuery, Post>(
      new GetPostByIdQuery(id),
    );
  }

  async update(
    updatePostInput: UpdatePostInput & { userId: string },
  ): Promise<Post> {
    const { id, userId } = updatePostInput;

    return await this.commandBus.execute<UpdatePostCommand, Post>(
      new UpdatePostCommand(id, userId, updatePostInput),
    );
  }

  async remove(removePostInput: RemovePostInput & { userId: string }) {
    const { id, userId } = removePostInput;

    return await this.commandBus.execute<RemovePostCommand, Post>(
      new RemovePostCommand(id, userId),
    );
  }

  async assignTag(assignTagInput: AssignTagInput & { userId: string }) {
    const { id, tagId, userId } = assignTagInput;

    return await this.commandBus.execute<AssignTagToPostCommand, Post>(
      new AssignTagToPostCommand(id, tagId, userId),
    );
  }

  async removeTag(removeTagInput: RemoveTagInput & { userId: string }) {
    const { id, tagId, userId } = removeTagInput;

    return await this.commandBus.execute<RemoveTagFromPostCommand, Post>(
      new RemoveTagFromPostCommand(id, tagId, userId),
    );
  }
}
