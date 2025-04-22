import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInput } from '../dto/create-post.input';
import { UpdatePostInput } from '../dto/update-post.input';
import { PostRepository } from '../repositories/post.repository';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  async create(createPostInput: CreatePostInput): Promise<Post> {
    return await this.postRepository.create({
      ...createPostInput,
      authorId: '7878c990-83c7-437e-a5db-2c133c6703d3',
    });
  }

  async findAll() {
    return await this.postRepository.findAll();
  }

  async findOneOrFail(id: string): Promise<Post> {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostInput: UpdatePostInput): Promise<Post> {
    return await this.postRepository.update(id, updatePostInput);
  }

  async remove(id: string) {
    return await this.postRepository.delete(id);
  }

  async assignTag(id: string, tagId: number) {
    return await this.postRepository.assignTag(id, tagId);
  }

  async removeTag(id: string, tagId: number) {
    return await this.postRepository.removeTag(id, tagId);
  }
}
