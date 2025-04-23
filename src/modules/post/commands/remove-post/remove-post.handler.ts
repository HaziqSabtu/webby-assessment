import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemovePostCommand } from './remove-post.command';
import { Post } from '../../entities/post.entity';
import { PostRepository } from '../../repositories/post.repository';

@CommandHandler(RemovePostCommand)
export class RemovePostHandler
  implements ICommandHandler<RemovePostCommand, Post>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute({ postId, userId }: RemovePostCommand): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new Error(`Post with id ${postId} not found`);
    }

    if (post.authorId !== userId) {
      throw new Error(`Unauthorized`);
    }

    return await this.postRepository.delete(postId);
  }
}
