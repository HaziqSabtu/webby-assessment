import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AssignTagInput {
  @Field()
  id: string;

  @Field(() => Int)
  tagId: number;
}
