import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { Post } from '../../entities/post.entity';
import { PostRepository } from '../../repositories/post.repository';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler
  implements ICommandHandler<CreatePostCommand, Post>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute({ input }: CreatePostCommand): Promise<Post> {
    return await this.postRepository.create(input);
  }
}
