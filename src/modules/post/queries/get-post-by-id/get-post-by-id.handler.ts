import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostByIdQuery } from './get-post-by-id.query';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdHandler
  implements IQueryHandler<GetPostByIdQuery, Post | null>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute({ postId }: GetPostByIdQuery): Promise<Post | null> {
    const post = await this.postRepository.findOne(postId);
    return post;
  }
}
