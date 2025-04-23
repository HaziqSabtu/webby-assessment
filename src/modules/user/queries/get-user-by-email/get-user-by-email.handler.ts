import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByEmailQuery } from './get-user-by-email.query';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery, User>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ email }: GetUserByEmailQuery): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    return user;
  }
}
