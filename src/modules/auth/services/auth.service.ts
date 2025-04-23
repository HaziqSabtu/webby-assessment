import { Injectable } from '@nestjs/common';
import { SignInInput } from '../dto/signin.input';
import { CommandBus } from '@nestjs/cqrs';
import { SignInResponse } from '../interfaces/sign-in-response';
import { SignInCommand } from '../commands/sign-in.command';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}

  async signIn(signInInput: SignInInput): Promise<SignInResponse> {
    const { username, password } = signInInput;

    return await this.commandBus.execute<SignInCommand, SignInResponse>(
      new SignInCommand(username, password),
    );
  }
}
