import { Injectable } from '@nestjs/common';
import { PostRepository, createInput, updateInput } from './post.repository';
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
      },
    });

    return new Post(post);
  }

  async findAll(): Promise<Post[]> {
    const data = await this.prisma.post.findMany({
      where: { deletedAt: null },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return data.map((post) => {
      const tags = post.postTags.map((postTag) => postTag.tag);
      return new Post({
        ...post,
        tags,
      });
    });
  }

  async findOne(id: string): Promise<Post | null> {
    const data = await this.prisma.post.findUnique({
      where: { id },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!data) {
      return null;
    }

    const tags = data.postTags.map((postTag) => postTag.tag);
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
        postTags: {
          include: {
            tag: true,
          },
        },
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
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return new Post(post);
  }
}
