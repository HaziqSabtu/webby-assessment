import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTagInput {
  @Field({ nullable: false })
  name: string;
}
