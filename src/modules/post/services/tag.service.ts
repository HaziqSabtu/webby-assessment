import { Injectable } from '@nestjs/common';
import { TagRepository } from '../repositories/tag.repository';
import { Tag } from '../entities/tag.entity';
import { CreateTagInput } from '../dto/create-tag.input';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async create(createTagInput: CreateTagInput): Promise<Tag> {
    return await this.tagRepository.create(createTagInput);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }
}
