import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class RemoveTagInput {
  @Field()
  id: string;

  @Field(() => Int)
  tagId: number;
}
