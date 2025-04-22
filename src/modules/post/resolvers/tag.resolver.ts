import { Resolver, Query } from '@nestjs/graphql';
import { Tag } from '../entities/tag.entity';
import { TagService } from '../services/tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tarService: TagService) {}

  @Query(() => [Tag], { name: 'tags' })
  findAll() {
    return this.tarService.findAll();
  }
}
