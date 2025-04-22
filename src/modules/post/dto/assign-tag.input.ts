import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class AssignTagInput {
  @IsString()
  @Field()
  id: string;

  @IsNumber()
  @Field(() => Int)
  tagId: number;
}
