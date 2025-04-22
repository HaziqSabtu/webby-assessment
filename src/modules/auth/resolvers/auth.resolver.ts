import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SignInInput } from '../dto/signin.input';
import { AuthService } from '../services/auth.service';

import { Public } from '../../../common/decorators/public.decorator';
import { SignInData } from '../entities/auth.entity';

@Resolver(() => SignInData)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignInData)
  signInUser(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }
}
