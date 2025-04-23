import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { CreateTagInput } from '../dto/create-tag.input';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllTagsQuery } from '../queries/get-all-tags/get-all-tags.query';
import { CreateTagCommand } from '../commands/create-tag/create-tag.command';

@Injectable()
export class TagService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(createTagInput: CreateTagInput): Promise<Tag> {
    return await this.commandBus.execute<CreateTagCommand, Tag>(
      new CreateTagCommand(createTagInput),
    );
  }

  async findAll(): Promise<Tag[]> {
    return await this.queryBus.execute<GetAllTagsQuery, Tag[]>(
      new GetAllTagsQuery(),
    );
  }
}
