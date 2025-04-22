import { InputType, Field } from '@nestjs/graphql';
import { IsValidPostContent } from 'src/common/validators/post-content.validator';
import { IsValidPostTitle } from 'src/common/validators/post-title.validator';

@InputType()
export class CreatePostInput {
  @IsValidPostTitle()
  @Field({ nullable: false })
  title: string;

  @IsValidPostContent()
  @Field({ nullable: false })
  content: string;
}
