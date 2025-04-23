import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllTagsQuery } from './get-all-tags.query';
import { Tag } from '../../entities/tag.entity';
import { TagRepository } from '../../repositories/tag.repository';

@QueryHandler(GetAllTagsQuery)
export class GetAllTagsHandler
  implements IQueryHandler<GetAllTagsQuery, Tag[]>
{
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }
}
