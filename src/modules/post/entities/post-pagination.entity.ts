import { ObjectType, Field } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
export class PostPagination {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => String, { nullable: true })
  nextCursor: string | null;
}
