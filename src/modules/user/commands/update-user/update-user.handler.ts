import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { UserRepository } from '../../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand, User>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ input }: UpdateUserCommand): Promise<User> {
    const { userId } = input;

    const isUserExist = await this.userRepository.findOneById(userId);

    if (!isUserExist) {
      throw new NotFoundException();
    }

    return await this.userRepository.update(input);
  }
}
