import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTagCommand } from './create-tag.command';
import { Tag } from '../../entities/tag.entity';
import { TagRepository } from '../../repositories/tag.repository';

@CommandHandler(CreateTagCommand)
export class CreateTagHandler
  implements ICommandHandler<CreateTagCommand, Tag>
{
  constructor(private readonly tagRepository: TagRepository) {}

  async execute({ input }: CreateTagCommand): Promise<Tag> {
    return await this.tagRepository.create(input);
  }
}
