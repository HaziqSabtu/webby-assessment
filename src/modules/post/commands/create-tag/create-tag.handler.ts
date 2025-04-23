import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTagCommand } from './create-tag.command';
import { Tag } from '../../entities/tag.entity';
import { TagRepository } from '../../repositories/tag.repository';
import { ConflictException } from '@nestjs/common';

@CommandHandler(CreateTagCommand)
export class CreateTagHandler
  implements ICommandHandler<CreateTagCommand, Tag>
{
  constructor(private readonly tagRepository: TagRepository) {}

  async execute({ input }: CreateTagCommand): Promise<Tag> {
    const { name } = input;

    const allTags = await this.tagRepository.findAll();

    const isTagNameExist = allTags.some((tag) => tag.name === name);

    if (isTagNameExist) {
      throw new ConflictException();
    }

    return await this.tagRepository.create(input);
  }
}
