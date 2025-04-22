import { Injectable } from '@nestjs/common';
import { TagRepository } from '../repositories/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async findAll() {
    return await this.tagRepository.findAll();
  }
}
