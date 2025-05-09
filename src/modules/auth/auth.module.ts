import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constants/jwt.constant';
import { AuthResolver } from './resolvers/auth.resolver';
import { SignInHandler } from './commands/sign-in.handler';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AuthResolver, AuthService, SignInHandler],
})
export class AuthModule {}
