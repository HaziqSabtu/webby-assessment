import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { UserResolver } from './resolvers/user.resolver';
import { GetUserByEmailHandler } from './queries/get-user-by-email/get-user-by-email.handler';
import { GetUserByUserIdHandler } from './queries/get-user-by-userId/get-user-by-userId.handler';
import { GetUserByUsernameHandler } from './queries/get-user-by-username/get-user-by-username.handler';
import { CreateUserHandler } from './commands/create-user/create-user.handler';
import { UpdateUserHandler } from './commands/update-user/update-user.handler';

@Module({
  providers: [
    UserResolver,
    UserService,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },

    // User - Query
    GetUserByEmailHandler,
    GetUserByUserIdHandler,
    GetUserByUsernameHandler,

    // User - Command
    CreateUserHandler,
    UpdateUserHandler,
  ],
  exports: [UserService],
})
export class UserModule {}
