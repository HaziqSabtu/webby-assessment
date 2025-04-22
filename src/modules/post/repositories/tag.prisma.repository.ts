import { Injectable } from '@nestjs/common';
import { TagRepository, createInput } from './tag.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagPrismaRepository implements TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInput: createInput): Promise<Tag> {
    const tag = await this.prisma.tag.create({
      data: {
        name: createInput.name,
      },
    });

    return new Tag(tag);
  }

  async findAll(): Promise<Tag[]> {
    const data = await this.prisma.tag.findMany({
      where: { deletedAt: null },
    });

    return data.map((tag) => new Tag(tag));
  }
}
