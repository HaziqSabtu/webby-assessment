import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RemovePostInput {
  @Field()
  id: string;
}
