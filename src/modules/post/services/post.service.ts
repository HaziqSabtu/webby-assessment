import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostInput } from '../dto/create-post.input';
import { FindAllPostInput } from '../dto/findAll-post.input';
import { UpdatePostInput } from '../dto/update-post.input';
import { RemovePostInput } from '../dto/remove-post.input';
import { AssignTagInput } from '../dto/assign-tag.input';
import { RemoveTagInput } from '../dto/remove-tag.input';
import { PostRepository } from '../repositories/post.repository';
import { Post } from '../entities/post.entity';
import { PostPagination } from '../entities/post-pagination.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  async create(
    createPostInput: CreatePostInput & { userId: string },
  ): Promise<Post> {
    return await this.postRepository.create({
      ...createPostInput,
      authorId: createPostInput.userId,
    });
  }

  async findAll(
    findAllPostInput: FindAllPostInput | undefined,
  ): Promise<PostPagination> {
    const result = await this.postRepository.findAll(findAllPostInput || {});
    return result;
  }

  async findOneOrFail(id: string): Promise<Post> {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(
    updatePostInput: UpdatePostInput & { userId: string },
  ): Promise<Post> {
    const { id, userId } = updatePostInput;
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException();
    }

    return await this.postRepository.update(id, updatePostInput);
  }

  async remove(removePostInput: RemovePostInput & { userId: string }) {
    const { id, userId } = removePostInput;
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException();
    }
    return await this.postRepository.delete(id);
  }

  async assignTag(assignTagInput: AssignTagInput & { userId: string }) {
    const { id, tagId, userId } = assignTagInput;
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException();
    }
    return await this.postRepository.assignTag(id, tagId);
  }

  async removeTag(removeTagInput: RemoveTagInput & { userId: string }) {
    const { id, tagId, userId } = removeTagInput;

    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException();
    }
    return await this.postRepository.removeTag(id, tagId);
  }
}
