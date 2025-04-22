import { Resolver, Query } from '@nestjs/graphql';
import { Tag } from '../entities/tag.entity';
import { TagService } from '../services/tag.service';
import { Public } from '../../../common/decorators/public.decorator';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tarService: TagService) {}

  @Public()
  @Query(() => [Tag], { name: 'tags' })
  findAll() {
    return this.tarService.findAll();
  }
}
