/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { UpdateUserCommand } from './update-user.command';
import { UpdateUserHandler } from './update-user.handler';
import { User } from '../../entities/user.entity';

describe('UpdateUserHandler', () => {
  let updateUserHandler: UpdateUserHandler;
  let userRepository: UserRepository;

  const mockUserId = 'userId1';

  const updateUserInput: UpdateUserCommand['input'] = {
    userId: mockUserId,
    bio: 'bio123',
    avatar: 'avatar.image.something',
  };

  const mockUser: User = {
    id: mockUserId,
    username: 'originalUsername',
    email: 'original@email.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    profile: {
      bio: 'originalBio',
      avatar: 'originalAvatar',
    },
  };

  const updatedMockUser: User = {
    ...mockUser,
    profile: {
      bio: updateUserInput.bio as string,
      avatar: updateUserInput.avatar as string,
    },
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateUserHandler,
        {
          provide: UserRepository,
          useValue: {
            findOneById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    updateUserHandler = await module.get(UpdateUserHandler);
    userRepository = await module.get(UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(updateUserHandler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'update');

      const command = new UpdateUserCommand(updateUserInput);
      const promise = updateUserHandler.execute(command);

      await expect(promise).rejects.toThrow(NotFoundException);
      expect(userRepository.findOneById).toBeCalledWith(updateUserInput.userId);
      expect(userRepository.update).not.toBeCalled();
    });

    it('should update and return user if user exists', async () => {
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(userRepository, 'update')
        .mockResolvedValueOnce(updatedMockUser);

      const command = new UpdateUserCommand(updateUserInput);
      const result = await updateUserHandler.execute(command);

      expect(result).toEqual(updatedMockUser);
      expect(userRepository.findOneById).toBeCalledWith(updateUserInput.userId);
      expect(userRepository.update).toBeCalledWith(updateUserInput);
    });
  });
});
