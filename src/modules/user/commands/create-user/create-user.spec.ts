/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserCommand } from './create-user.command';
import { CreateUserHandler } from './create-user.handler';
import { User } from '../../entities/user.entity';

const createUserInput: CreateUserCommand['input'] = {
  username: 'username123',
  email: 'email123@gmail.com',
  password: 'password123',
  bio: 'bio123',
  avatar: 'avatar.image.something',
};

const mockUser: User = {
  id: 'userId1',
  username: createUserInput.username,
  email: createUserInput.email,
  password: createUserInput.password,
  createdAt: new Date(),
  profile: {
    bio: createUserInput.bio,
    avatar: createUserInput.avatar,
  },
};

describe('CreateUserHandler', () => {
  let createUserHandler: CreateUserHandler;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: UserRepository,
          useValue: {
            findByUsername: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserHandler = await module.get(CreateUserHandler);
    userRepository = await module.get(UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(createUserHandler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw ConflictException if username already exists', async () => {
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockResolvedValueOnce(mockUser);
      jest.spyOn(userRepository, 'findByEmail');
      jest.spyOn(userRepository, 'create');

      const command = new CreateUserCommand(createUserInput);
      const promise = createUserHandler.execute(command);

      await expect(promise).rejects.toThrow(ConflictException);
      expect(userRepository.findByUsername).toHaveBeenCalledWith(
        createUserInput.username,
      );
      expect(userRepository.findByEmail).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(userRepository, 'create');

      const command = new CreateUserCommand(createUserInput);
      const promise = createUserHandler.execute(command);

      await expect(promise).rejects.toThrow(ConflictException);
      expect(userRepository.findByUsername).toHaveBeenCalledWith(
        createUserInput.username,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        createUserInput.email,
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should create and return user if username and email do not exist', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'create').mockResolvedValueOnce(mockUser);

      const command = new CreateUserCommand(createUserInput);
      const result = await createUserHandler.execute(command);

      expect(result).toEqual(mockUser);
      expect(userRepository.findByUsername).toHaveBeenCalledWith(
        createUserInput.username,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        createUserInput.email,
      );
      expect(userRepository.create).toHaveBeenCalledWith(createUserInput);
    });
  });
});
