import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PostService } from '../services/post.service';
import { Post } from '../entities/post.entity';
import { CreatePostInput } from '../dto/create-post.input';
import { UpdatePostInput } from '../dto/update-post.input';
import { AssignTagInput } from '../dto/assign-tag.input';
import { RemoveTagInput } from '../dto/remove-tag.input';

import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { NotFoundException } from '@nestjs/common';
import { UserCtx } from '../../../common/decorators/user.decorator';
import { AuthUser } from 'src/common/interfaces/auth.interface';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @UserCtx() user: AuthUser,
  ) {
    return this.postService.create({
      ...createPostInput,
      userId: user.userId,
    });
  }

  @ResolveField(() => User, { name: 'author' })
  async resolveAuthor(@Parent() post: Post): Promise<User> {
    const user = await this.userService.findOneOrFailById(post.authorId);

    if (!user) {
      throw new NotFoundException(`User with id ${post.authorId} not found`);
    }

    return user;
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id') id: string) {
    return this.postService.findOneOrFail(id);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args('id') id: string) {
    return this.postService.remove(id);
  }

  @Mutation(() => Post)
  assignTag(@Args('assignTagInput') assignTagInput: AssignTagInput) {
    const { id, tagId } = assignTagInput;
    return this.postService.assignTag(id, tagId);
  }

  @Mutation(() => Post)
  removeTag(@Args('removeTagInput') removeTagInput: RemoveTagInput) {
    const { id, tagId } = removeTagInput;
    return this.postService.removeTag(id, tagId);
  }
}
