export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly password: string;
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
