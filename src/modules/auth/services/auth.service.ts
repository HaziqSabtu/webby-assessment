import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { SignInInput } from '../dto/signin.input';
import { JwtService } from '@nestjs/jwt';

export interface SignInResponse {
  token: string;
  expiresAt: Date;
  user: Pick<User, 'id'>;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInInput: SignInInput): Promise<SignInResponse> {
    let user: User;
    try {
      user = await this.userService.findByUsername(signInInput.username);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Wrong username or password');
      }
      throw error;
    }

    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }

    if (user.password !== signInInput.password) {
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
