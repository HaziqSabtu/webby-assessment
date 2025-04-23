import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../repositories/user.repository';
import { ConflictException } from '@nestjs/common';
import { User } from '../../entities/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, User>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ input }: CreateUserCommand): Promise<User> {
    const { username, email } = input;

    const isUserNameExist = await this.userRepository.findByUsername(username);

    if (isUserNameExist) {
      throw new ConflictException();
    }

    const isEmailExist = await this.userRepository.findByEmail(email);

    if (isEmailExist) {
      throw new ConflictException();
    }

    return await this.userRepository.create(input);
  }
}
