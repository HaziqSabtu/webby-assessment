import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class SignInInput {
  @IsString()
  @Field({ nullable: false })
  username: string;

  @IsString()
  @Field({ nullable: false })
  password: string;
}
