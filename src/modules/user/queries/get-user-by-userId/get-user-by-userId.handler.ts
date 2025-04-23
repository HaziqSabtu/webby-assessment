import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByUserIdQuery } from './get-user-by-userId.query';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@QueryHandler(GetUserByUserIdQuery)
export class GetUserByUserIdHandler
  implements IQueryHandler<GetUserByUserIdQuery, User>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: GetUserByUserIdQuery): Promise<User> {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return user;
  }
}
