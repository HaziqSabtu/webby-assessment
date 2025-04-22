import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagPrismaRepository implements TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Tag[]> {
    const data = await this.prisma.tag.findMany({
      where: { deletedAt: null },
    });

    return data.map((tag) => new Tag(tag));
  }
}
