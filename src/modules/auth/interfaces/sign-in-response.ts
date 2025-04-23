import { User } from '@prisma/client';

export interface SignInResponse {
  token: string;
  expiresAt: Date;
  user: Pick<User, 'id'>;
}
