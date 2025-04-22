import { InputType, Field } from '@nestjs/graphql';

import { IsValidUsername } from '../../../common/validators/username.validator';
import { IsStrongPassword } from '../../../common/validators/password.validator';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsValidUsername()
  @Field({ nullable: false })
  username: string;

  @IsEmail()
  @Field({ nullable: false })
  email: string;

  @IsStrongPassword()
  @Field({ nullable: false })
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Field({ nullable: false })
  bio: string;

  @IsUrl()
  @Field({ nullable: false })
  avatar: string;
}
