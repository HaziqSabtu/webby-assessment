/* eslint-disable @typescript-eslint/unbound-method */

import { Test } from '@nestjs/testing';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserByUsernameQuery } from './get-user-by-username.query';
import { GetUserByUsernameHandler } from './get-user-by-username.handler';
import { User } from '../../entities/user.entity';

describe('GetUserByUsernameHandler', () => {
  let getUserByUsernameHandler: GetUserByUsernameHandler;
  let userRepository: UserRepository;

  const mockUsername = 'testuser';

  const mockUser: User = {
    id: 'userId1',
    username: mockUsername,
    email: 'test@example.com',
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
        GetUserByUsernameHandler,
        {
          provide: UserRepository,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    getUserByUsernameHandler = await module.get(GetUserByUsernameHandler);
    userRepository = await module.get(UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(getUserByUsernameHandler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw an error if user with username is not found', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValueOnce(null);

      const query = new GetUserByUsernameQuery(mockUsername);
      const promise = getUserByUsernameHandler.execute(query);

      await expect(promise).rejects.toThrow(
        `User with username ${mockUsername} not found`,
      );
      expect(userRepository.findByUsername).toHaveBeenCalledWith(mockUsername);
    });

    it('should return user if user with username exists', async () => {
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockResolvedValueOnce(mockUser);

      const query = new GetUserByUsernameQuery(mockUsername);
      const result = await getUserByUsernameHandler.execute(query);

      expect(result).toEqual(mockUser);
      expect(userRepository.findByUsername).toHaveBeenCalledWith(mockUsername);
    });
  });
});
