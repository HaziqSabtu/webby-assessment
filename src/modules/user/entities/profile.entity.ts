import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field({ nullable: false })
  public readonly bio: string;

  @Field({ nullable: false })
  public readonly avatar: string;

  constructor({ bio, avatar }: { bio: string; avatar: string }) {
    this.bio = bio;
    this.avatar = avatar;
  }
}
