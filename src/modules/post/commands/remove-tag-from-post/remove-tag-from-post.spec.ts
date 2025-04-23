/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RemoveTagFromPostCommand } from './remove-tag-from-post.command';
import { RemoveTagFromPostHandler } from './remove-tag-from-post.handler';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';

describe('RemoveTagFromPostHandler', () => {
  let removeTagFromPostHandler: RemoveTagFromPostHandler;
  let postRepository: PostRepository;

  const mockPost = {
    id: 'post-123',
    title: 'Test Post',
    content: 'Test Content',
    authorId: 'user-123',
    tags: [{ id: 123, name: 'Test Tag' }],
  } as Post;

  const commandInput = {
    postId: 'post-123',
    tagId: 123,
    userId: 'user-123',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RemoveTagFromPostHandler,
        {
          provide: PostRepository,
          useValue: {
            findOne: jest.fn(),
            removeTag: jest.fn(),
          },
        },
      ],
    }).compile();

    removeTagFromPostHandler = module.get<RemoveTagFromPostHandler>(
      RemoveTagFromPostHandler,
    );
    postRepository = module.get<PostRepository>(PostRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(removeTagFromPostHandler).toBeDefined();
    expect(postRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw NotFoundException when post is not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      const command = new RemoveTagFromPostCommand(
        commandInput.postId,
        commandInput.tagId,
        commandInput.userId,
      );

      await expect(removeTagFromPostHandler.execute(command)).rejects.toThrow(
        NotFoundException,
      );
      expect(postRepository.findOne).toHaveBeenCalledWith('post-123');
      expect(postRepository.removeTag).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is not the author', async () => {
      const differentAuthorPost = { ...mockPost, authorId: 'different-user' };
      jest
        .spyOn(postRepository, 'findOne')
        .mockResolvedValue(differentAuthorPost);

      const command = new RemoveTagFromPostCommand(
        commandInput.postId,
        commandInput.tagId,
        commandInput.userId,
      );
      await expect(removeTagFromPostHandler.execute(command)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(postRepository.findOne).toHaveBeenCalledWith('post-123');
      expect(postRepository.removeTag).not.toHaveBeenCalled();
    });

    it('should remove tag from post when user is authorized', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);
      jest.spyOn(postRepository, 'removeTag').mockResolvedValue({
        ...mockPost,
        tags: [],
      } as Post);

      const command = new RemoveTagFromPostCommand(
        commandInput.postId,
        commandInput.tagId,
        commandInput.userId,
      );
      const result = await removeTagFromPostHandler.execute(command);

      expect(postRepository.findOne).toHaveBeenCalledWith('post-123');
      expect(postRepository.removeTag).toHaveBeenCalledWith('post-123', 123);
      expect(result.tags).toHaveLength(0);
    });
  });
});
