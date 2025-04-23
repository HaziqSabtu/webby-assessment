import { Injectable } from '@nestjs/common';
import {
  PostRepository,
  createInput,
  updateInput,
  findAllInput,
} from './post.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostPrismaRepository implements PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: createInput): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        tags: {
          connect: data.tagIds.map((tagId) => ({ id: tagId })),
        },
      },
      include: {
        tags: true,
      },
    });

    return new Post(post);
  }

  async findAll(
    params: findAllInput,
  ): Promise<{ posts: Post[]; nextCursor: string | null }> {
    const { searchText, tagId, cursor, authorId, take = 10 } = params;

    const data = await this.prisma.post.findMany({
      where: {
        deletedAt: null,
        authorId: authorId ? authorId : undefined,
        OR: searchText
          ? [
              { title: { contains: searchText } },
              { content: { contains: searchText } },
            ]
          : undefined,
        tags: tagId ? { some: { id: tagId } } : undefined,
      },
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });

    const nextCursor = data.length > 0 ? data[data.length - 1].id : null;

    return {
      posts: data.map((post) => {
        return new Post(post);
      }),
      nextCursor,
    };
  }

  async findOne(id: string): Promise<Post | null> {
    const data = await this.prisma.post.findUnique({
      where: { id, deletedAt: null },
      include: {
        tags: true,
      },
    });

    if (!data) {
      return null;
    }

    const tags = data.tags;
    return new Post({
      ...data,
      tags,
    });
  }

  async update(id: string, data: updateInput): Promise<Post> {
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
      },
      include: {
        tags: true,
      },
    });

    return new Post(post);
  }

  async delete(id: string): Promise<Post> {
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        tags: true,
      },
    });

    return new Post(post);
  }

  async assignTag(id: string, tagId: number): Promise<Post> {
    const post = await this.prisma.post.update({
      where: { id: id },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
      include: {
        tags: true,
      },
    });

    return new Post(post);
  }

  async removeTag(id: string, tagId: number): Promise<Post> {
    const post = await this.prisma.post.update({
      where: { id: id },
      data: {
        tags: {
          disconnect: { id: tagId },
        },
      },
      include: {
        tags: true,
      },
    });

    return new Post(post);
  }
}
