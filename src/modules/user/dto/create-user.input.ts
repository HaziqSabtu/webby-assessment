import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;

  @Field({ nullable: false })
  bio: string;

  @Field({ nullable: false })
  avatar: string;
}
