import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class CreateTagInput {
  @IsString()
  @MinLength(1)
  @Field({ nullable: false })
  name: string;
}
