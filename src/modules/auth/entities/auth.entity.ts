import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInData {
  @Field()
  public readonly token: string;

  @Field()
  public readonly expiresAt: Date;

  constructor({ token, expiresAt }: { token: string; expiresAt: Date }) {
    this.token = token;
    this.expiresAt = expiresAt;
  }
}
