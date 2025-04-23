import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCommand } from './update-post.command';
import { Post } from '../../entities/post.entity';
import { PostRepository } from '../../repositories/post.repository';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler
  implements ICommandHandler<UpdatePostCommand, Post>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute({ postId, input, userId }: UpdatePostCommand): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new Error(`Post with id ${postId} not found`);
    }

    if (post.authorId !== userId) {
      throw new Error(`Unauthorized`);
    }

    return await this.postRepository.update(postId, input);
  }
}
