import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { UserResolver } from './resolvers/user.resolver';

@Module({
  providers: [
    UserResolver,
    UserService,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
