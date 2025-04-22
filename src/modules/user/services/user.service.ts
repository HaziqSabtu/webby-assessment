import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { username, email } = createUserInput;
    const isUserNameExist = await this.userRepository.findByUsername(username);

    if (isUserNameExist) {
      throw new ConflictException();
    }

    const isEmailExist = await this.userRepository.findByEmail(email);

    if (isEmailExist) {
      throw new ConflictException();
    }

    return await this.userRepository.create(createUserInput);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async findOneOrFailById(id: string): Promise<User> {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(
    updateUserInput: UpdateUserInput & { userId: string },
  ): Promise<User> {
    return await this.userRepository.update(updateUserInput);
  }
}
