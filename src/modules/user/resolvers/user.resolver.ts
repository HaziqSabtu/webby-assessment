import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';

import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';

import { UserCtx } from '../../../common/decorators/user.decorator';
import { AuthUser } from '../../../common/interfaces/auth.interface';
import { Public } from '../../../common/decorators/public.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Mutation(() => User)
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
