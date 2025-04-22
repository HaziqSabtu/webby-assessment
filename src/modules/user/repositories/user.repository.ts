import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';

export type createInput = {
  username: User['username'];
  email: User['email'];
  password: User['password'];
  bio: Profile['bio'];
  avatar: Profile['avatar'];
};

export type updateInput = {
  userId: User['id'];
  bio?: Profile['bio'];
  avatar?: Profile['avatar'];
};

export abstract class UserRepository {
  abstract create(data: createInput): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findOneById(id: string): Promise<User | null>;
  abstract update(data: updateInput): Promise<User>;
}
