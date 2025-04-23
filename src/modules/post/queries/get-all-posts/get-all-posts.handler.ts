import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPostsQuery } from './get-all-posts.query';
import { PostRepository } from '../../repositories/post.repository';
import { PostPagination } from '../../entities/post-pagination.entity';

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler
  implements IQueryHandler<GetAllPostsQuery, PostPagination>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute({ query }: GetAllPostsQuery): Promise<PostPagination> {
    const post = await this.postRepository.findAll(query);
    return post;
  }
}
