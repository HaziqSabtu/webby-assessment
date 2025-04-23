/* eslint-disable @typescript-eslint/unbound-method */

import { Test } from '@nestjs/testing';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserByEmailQuery } from './get-user-by-email.query';
import { GetUserByEmailHandler } from './get-user-by-email.handler';
import { User } from '../../entities/user.entity';

describe('GetUserByEmailHandler', () => {
  let getUserByEmailHandler: GetUserByEmailHandler;
  let userRepository: UserRepository;

  const mockEmail = 'test@example.com';

  const mockUser: User = {
    id: 'userId1',
    username: 'testuser',
    email: mockEmail,
    password: 'hashedPassword',
    createdAt: new Date(),
    profile: {
      bio: 'bio123',
      avatar: 'avatar.image.something',
    },
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserByEmailHandler,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    getUserByEmailHandler = await module.get(GetUserByEmailHandler);
    userRepository = await module.get(UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(getUserByEmailHandler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw an error if user with email is not found', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

      const query = new GetUserByEmailQuery(mockEmail);
      const promise = getUserByEmailHandler.execute(query);

      await expect(promise).rejects.toThrow(
        `User with email ${mockEmail} not found`,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
    });

    it('should return user if user with email exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(mockUser);

      const query = new GetUserByEmailQuery(mockEmail);
      const result = await getUserByEmailHandler.execute(query);

      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
    });
  });
});
