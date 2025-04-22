import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Profile } from './profile.entity';

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

  @Field(() => Profile)
  public readonly profile: Profile | null;

  constructor({
    id,
    username,
    email,
    password,
    createdAt,
    profile,
  }: {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    profile: {
      bio: string;
      avatar: string;
    } | null;
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.profile = profile ? new Profile(profile) : profile;
  }
}
