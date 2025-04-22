import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Tag } from '../entities/tag.entity';
import { TagService } from '../services/tag.service';
import { Public } from '../../../common/decorators/public.decorator';
import { CreateTagInput } from '../dto/create-tag.input';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Mutation(() => Tag)
  createTag(@Args('createTagInput') createTagInput: CreateTagInput) {
    return this.tagService.create(createTagInput);
  }

  @Public()
  @Query(() => [Tag], { name: 'tags' })
  findAll() {
    return this.tagService.findAll();
  }
}
