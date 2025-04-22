import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field({ nullable: false })
  title: string;

  @Field({ nullable: false })
  content: string;
}
