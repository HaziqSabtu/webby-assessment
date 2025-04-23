import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserByEmailQuery } from '../queries/get-user-by-email/get-user-by-email.query';
import { GetUserByUsernameQuery } from '../queries/get-user-by-username/get-user-by-username.query';
import { GetUserByUserIdQuery } from '../queries/get-user-by-userId/get-user-by-userId.query';
import { CreateUserCommand } from '../commands/create-user/create-user.command';
import { UpdateUserCommand } from '../commands/update-user/update-user.command';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    return await this.commandBus.execute<CreateUserCommand, User>(
      new CreateUserCommand(createUserInput),
    );
  }

  async findByEmail(email: string): Promise<User> {
    return await this.queryBus.execute<GetUserByEmailQuery, User>(
      new GetUserByEmailQuery(email),
    );
  }

  async findByUsername(username: string): Promise<User> {
    return await this.queryBus.execute<GetUserByUsernameQuery, User>(
      new GetUserByUsernameQuery(username),
    );
  }

  async findOneOrFailById(id: string): Promise<User> {
    return await this.queryBus.execute<GetUserByUserIdQuery, User>(
      new GetUserByUserIdQuery(id),
    );
  }

  async update(
    updateUserInput: UpdateUserInput & { userId: string },
  ): Promise<User> {
    return await this.commandBus.execute<UpdateUserCommand, User>(
      new UpdateUserCommand(updateUserInput),
    );
  }
}
