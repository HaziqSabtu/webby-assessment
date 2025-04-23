import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';

import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';

import { UserCtx } from '../../../common/decorators/user.decorator';
import { AuthUser } from '../../../common/interfaces/auth.interface';

import { UnauthenticatedOnly } from 'src/common/decorators/unauthenticated-only.decorators';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  @UnauthenticatedOnly()
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => User, { name: 'me' })
  findOne(@UserCtx() user: AuthUser) {
    return this.userService.findOneOrFailById(user.userId);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @UserCtx() user: AuthUser,
  ) {
    return this.userService.update({
      ...updateUserInput,
      userId: user.userId,
    });
  }
}
