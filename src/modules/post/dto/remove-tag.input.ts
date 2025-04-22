import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class RemoveTagInput {
  @IsString()
  @Field()
  id: string;

  @IsNumber()
  @Field(() => Int)
  tagId: number;
}
