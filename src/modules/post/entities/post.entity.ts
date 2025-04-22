import { ObjectType, Field, ID } from '@nestjs/graphql';

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

  constructor({
    id,
    title,
    content,
    createdAt,
    updatedAt,
  }: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
