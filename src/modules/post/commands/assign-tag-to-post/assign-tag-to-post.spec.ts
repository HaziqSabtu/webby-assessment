/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AssignTagToPostCommand } from './assign-tag-to-post.command';
import { AssignTagToPostHandler } from './assign-tag-to-post.handler';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';

describe('AssignTagToPostHandler', () => {
  let assignTagToPostHandler: AssignTagToPostHandler;
  let postRepository: PostRepository;

  const mockPost = {
    id: 'post-123',
    title: 'Test Post',
    content: 'Test Content',
    authorId: 'user-123',
  } as Post;

  const commandInput = {
    postId: 'post-123',
    tagId: 123,
    userId: 'user-123',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AssignTagToPostHandler,
        {
          provide: PostRepository,
          useValue: {
            findOne: jest.fn(),
            assignTag: jest.fn(),
          },
        },
      ],
    }).compile();

    assignTagToPostHandler = module.get<AssignTagToPostHandler>(
      AssignTagToPostHandler,
    );
    postRepository = module.get<PostRepository>(PostRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(assignTagToPostHandler).toBeDefined();
    expect(postRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw NotFoundException when post is not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      const command = new AssignTagToPostCommand(
        commandInput.postId,
        commandInput.tagId,
        commandInput.userId,
      );

      await expect(assignTagToPostHandler.execute(command)).rejects.toThrow(
        NotFoundException,
      );
      expect(postRepository.findOne).toHaveBeenCalledWith('post-123');
      expect(postRepository.assignTag).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is not the author', async () => {
      const differentAuthorPost = { ...mockPost, authorId: 'different-user' };
      jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValue(differentAuthorPost);

      const command = new AssignTagToPostCommand(
        commandInput.postId,
        commandInput.tagId,
        commandInput.userId,
      );
      await expect(assignTagToPostHandler.execute(command)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(postRepository.findOne).toHaveBeenCalledWith('post-123');
      expect(postRepository.assignTag).not.toHaveBeenCalled();
    });

    it('should assign tag to post when user is authorized', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);
      jest.spyOn(postRepository, 'assignTag').mockResolvedValue({
        ...mockPost,
        tags: [{ id: 123, name: 'Test Tag' }],
      } as Post);

      const command = new AssignTagToPostCommand(
        commandInput.postId,
        commandInput.tagId,
        commandInput.userId,
      );
      const result = await assignTagToPostHandler.execute(command);

      expect(postRepository.findOne).toHaveBeenCalledWith('post-123');
      expect(postRepository.assignTag).toHaveBeenCalledWith('post-123', 123);
      expect(result).toHaveProperty('tags');
      expect(result.tags[0]).toHaveProperty('id', 123);
    });
  });
});
