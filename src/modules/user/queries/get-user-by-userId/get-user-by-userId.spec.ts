/* eslint-disable @typescript-eslint/unbound-method */

import { Test } from '@nestjs/testing';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserByUserIdQuery } from './get-user-by-userId.query';
import { GetUserByUserIdHandler } from './get-user-by-userId.handler';
import { User } from '../../entities/user.entity';

describe('GetUserByUserIdHandler', () => {
  let getUserByUserIdHandler: GetUserByUserIdHandler;
  let userRepository: UserRepository;

  const mockUserId = 'userId1';

  const mockUser: User = {
    id: mockUserId,
    username: 'testuser',
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
        GetUserByUserIdHandler,
        {
          provide: UserRepository,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    getUserByUserIdHandler = await module.get(GetUserByUserIdHandler);
    userRepository = await module.get(UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(getUserByUserIdHandler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw an error if user with id is not found', async () => {
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(null);

      const query = new GetUserByUserIdQuery(mockUserId);
      const promise = getUserByUserIdHandler.execute(query);

      await expect(promise).rejects.toThrow(
        `User with id ${mockUserId} not found`,
      );
      expect(userRepository.findOneById).toHaveBeenCalledWith(mockUserId);
    });

    it('should return user if user with id exists', async () => {
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(mockUser);

      const query = new GetUserByUserIdQuery(mockUserId);
      const result = await getUserByUserIdHandler.execute(query);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOneById).toHaveBeenCalledWith(mockUserId);
    });
  });
});
