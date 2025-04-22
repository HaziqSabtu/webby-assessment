import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  public readonly id: string;

  @Field({ nullable: false })
  public readonly username: string;

  @Field({ nullable: false })
  public readonly email: string;

  // @Field({ nullable: false })
  public readonly password: string;

  @Field({ nullable: false })
  public readonly createdAt: Date;

  constructor({
    id,
    username,
    email,
    password,
    createdAt,
  }: {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }
}
