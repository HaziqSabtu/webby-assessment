import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AssignTagToPostCommand } from './assign-tag-to-post.command';
import { Post } from '../../entities/post.entity';
import { PostRepository } from '../../repositories/post.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

@CommandHandler(AssignTagToPostCommand)
export class AssignTagToPostHandler
  implements ICommandHandler<AssignTagToPostCommand, Post>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute({
    postId,
    tagId,
    userId,
  }: AssignTagToPostCommand): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException();
    }
    return await this.postRepository.assignTag(postId, tagId);
  }
}
