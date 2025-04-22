import { Injectable } from '@nestjs/common';
import { UserRepository, createInput, updateInput } from './user.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: createInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        profile: {
          create: {
            bio: data.bio,
            avatar: data.avatar,
          },
        },
      },
      include: { profile: true },
    });

    return new User(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: {
        profile: true,
      },
    });

    if (!data) {
      return null;
    }

    return new User(data);
  }

  async findByUsername(username: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { username, deletedAt: null },
      include: { profile: true },
    });

    if (!data) {
      return null;
    }

    return new User(data);
  }

  async findOneById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!data) {
      return null;
    }

    return new User(data);
  }

  async update(data: updateInput): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: data.userId },
      data: {
        profile: {
          update: {
            bio: data.bio,
            avatar: data.avatar,
          },
        },
      },
      include: { profile: true },
    });
    return new User(user);
  }
}
