import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostByIdQuery } from './get-post-by-id.query';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdHandler
  implements IQueryHandler<GetPostByIdQuery, Post>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute({ postId }: GetPostByIdQuery): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return post;
  }
}
