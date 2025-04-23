import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveTagFromPostCommand } from './remove-tag-from-post.command';
import { Post } from '../../entities/post.entity';
import { PostRepository } from '../../repositories/post.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

@CommandHandler(RemoveTagFromPostCommand)
export class RemoveTagFromPostHandler
  implements ICommandHandler<RemoveTagFromPostCommand, Post>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute({
    postId,
    tagId,
    userId,
  }: RemoveTagFromPostCommand): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException();
    }
    return await this.postRepository.removeTag(postId, tagId);
  }
}
