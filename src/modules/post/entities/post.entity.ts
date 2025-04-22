import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Tag } from './tag.entity';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field({ nullable: false })
  title: string;

  @Field({ nullable: false })
  content: string;

  // @Field({ nullable: false })
  // @authorId: string;

  @Field({ nullable: false })
  createdAt: Date;

  @Field({ nullable: false })
  updatedAt: Date;

  @Field(() => [Tag])
  tags?: Tag[];

  constructor({
    id,
    title,
    content,
    createdAt,
    updatedAt,
    tags,
  }: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.tags = tags;
  }
}
