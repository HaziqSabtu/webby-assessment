import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class RemovePostInput {
  @IsString()
  @Field()
  id: string;
}
