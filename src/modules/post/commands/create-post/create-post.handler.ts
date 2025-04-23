import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { Post } from '../../entities/post.entity';
import { PostRepository } from '../../repositories/post.repository';
import { TagRepository } from '../../repositories/tag.repository';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler
  implements ICommandHandler<CreatePostCommand, Post>
{
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async execute({ input }: CreatePostCommand): Promise<Post> {
    if (input.tagIds?.length !== 0) {
      const allTags = await this.tagRepository.findAll();

      const invalidTagIds = input.tagIds?.filter(
        (tagId) => !allTags.some((tag) => tag.id === tagId),
      );

      if (invalidTagIds?.length) {
        throw new BadRequestException(
          `Tag with id ${invalidTagIds.join(', ')} does not exist`,
        );
      }
    }

    return await this.postRepository.create(input);
  }
}
