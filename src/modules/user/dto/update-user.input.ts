import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(CreateUserInput, ['bio', 'avatar']),
) {}
