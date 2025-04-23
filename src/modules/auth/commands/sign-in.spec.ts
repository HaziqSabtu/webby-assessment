/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { SignInCommand } from './sign-in.command';
import { SignInHandler } from './sign-in.handler';

describe('SignInHandler', () => {
  let signInHandler: SignInHandler;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUsername = 'testuser';
  const mockPassword = 'password123';
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockToken = 'mock.jwt.token';

  const mockUser: User = {
    id: mockUserId,
    username: mockUsername,
    password: mockPassword,
    email: 'test@example.com',
    createdAt: new Date(),
    profile: {
      bio: 'bio123',
      avatar: 'avatar.image.something',
    },
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SignInHandler,
        {
          provide: UserService,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    signInHandler = await module.get(SignInHandler);
    userService = await module.get(UserService);
    jwtService = await module.get(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(signInHandler).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('execute', () => {
    it('should throw UnauthorizedException if user service throws NotFoundException', async () => {
      jest
        .spyOn(userService, 'findByUsername')
        .mockRejectedValueOnce(new NotFoundException());

      const command = new SignInCommand(mockUsername, mockPassword);
      const promise = signInHandler.execute(command);

      await expect(promise).rejects.toThrow(UnauthorizedException);
      await expect(promise).rejects.toThrow('Wrong username or password');
      expect(userService.findByUsername).toHaveBeenCalledWith(mockUsername);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(userService, 'findByUsername').mockResolvedValueOnce(mockUser);

      const command = new SignInCommand(mockUsername, 'wrongpassword');
      const promise = signInHandler.execute(command);

      await expect(promise).rejects.toThrow(UnauthorizedException);
      await expect(promise).rejects.toThrow('Wrong username or password');
      expect(userService.findByUsername).toHaveBeenCalledWith(mockUsername);
    });

    it('should return token and user info if credentials are correct', async () => {
      jest.spyOn(userService, 'findByUsername').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(mockToken);

      // Mock Date.now for consistent testing
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.useFakeTimers().setSystemTime(mockDate);

      const command = new SignInCommand(mockUsername, mockPassword);
      const result = await signInHandler.execute(command);

      const expectedPayload = {
        sub: mockUserId,
        userId: mockUserId,
        iss: 'webby-asssesment',
        aud: 'webby-asssesment',
      };

      const expectedOptions = {
        expiresIn: '1h',
      };

      const expectedExpiration = new Date(mockDate.getTime() + 60 * 60 * 1000);

      expect(result).toEqual({
        token: mockToken,
        expiresAt: expectedExpiration,
        user: {
          id: mockUserId,
        },
      });

      expect(userService.findByUsername).toHaveBeenCalledWith(mockUsername);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expectedPayload,
        expectedOptions,
      );

      // Restore Date
      jest.useRealTimers();
    });

    it('should rethrow any non-NotFoundException errors from userService', async () => {
      const customError = new Error('Database connection error');
      jest
        .spyOn(userService, 'findByUsername')
        .mockRejectedValueOnce(customError);

      const command = new SignInCommand(mockUsername, mockPassword);
      const promise = signInHandler.execute(command);

      await expect(promise).rejects.toThrow('Database connection error');
      expect(userService.findByUsername).toHaveBeenCalledWith(mockUsername);
    });
  });
});
