import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInResponse } from '../interfaces/sign-in-response';

@CommandHandler(SignInCommand)
export class SignInHandler
  implements ICommandHandler<SignInCommand, SignInResponse>
{
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    username,
    password,
  }: SignInCommand): Promise<SignInResponse> {
    let user: User;
    try {
      user = await this.userService.findByUsername(username);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Wrong username or password');
      }
      throw error;
    }

    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Wrong username or password');
    }

    const tokenDurationMilli = 60 * 60 * 1000; // 1 hour
    const expiresAt = new Date().getTime() + tokenDurationMilli;

    const payload = {
      sub: user.id,
      userId: user.id,
      iss: 'webby-asssesment',
      aud: 'webby-asssesment',
    };

    const options = {
      expiresIn: '1h',
    };

    const token = await this.jwtService.signAsync(payload, options);

    return {
      token: token,
      expiresAt: new Date(expiresAt),
      user: {
        id: user.id,
      },
    };
  }
}
