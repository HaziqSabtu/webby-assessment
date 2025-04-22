import { IsString } from 'class-validator';
import { CreatePostInput } from './create-post.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @IsString()
  @Field()
  id: string;
}
