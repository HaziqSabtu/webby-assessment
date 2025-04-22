import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInput } from '../dto/create-post.input';
import { UpdatePostInput } from '../dto/update-post.input';
import { PostRepository } from '../repositories/post.repository';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  // create(createPostInput: CreatePostInput) {
  //   return 'This action adds a new post';
  // }

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

  // update(id: number, updatePostInput: UpdatePostInput) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
