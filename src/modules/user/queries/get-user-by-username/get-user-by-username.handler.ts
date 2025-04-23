import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByUsernameQuery } from './get-user-by-username.query';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@QueryHandler(GetUserByUsernameQuery)
export class GetUserByUsernameHandler
  implements IQueryHandler<GetUserByUsernameQuery, User>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ username }: GetUserByUsernameQuery): Promise<User> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }

    return user;
  }
}
