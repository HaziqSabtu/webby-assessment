import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostPrismaRepository implements PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Post[]> {
    const data = await this.prisma.post.findMany({
      where: { deletedAt: null },
    });

    return data.map((post) => new Post(post));
  }
}
