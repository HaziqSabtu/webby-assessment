/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { RemovePostHandler } from './remove-post.handler';
import { RemovePostCommand } from './remove-post.command';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';

const postId = 'postId1';
const userId = 'userId1';
const differentUserId = 'userId2';

const existingPost: Post = {
  id: postId,
  title: 'Test Post',
  content: 'This is a test post content',
  authorId: userId,
  tags: [],
  author: {
    id: userId,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    profile: {
      bio: 'bio123',
      avatar: 'avatar.image.something',
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('RemovePostHandler', () => {
  let removePostHandler: RemovePostHandler;
  let postRepository: PostRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RemovePostHandler,
        {
          provide: PostRepository,
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    removePostHandler = await module.get(RemovePostHandler);
    postRepository = await module.get(PostRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(removePostHandler).toBeDefined();
    expect(postRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw an error if post does not exist', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(postRepository, 'delete');

      const command = new RemovePostCommand(postId, userId);
      const promise = removePostHandler.execute(command);

      await expect(promise).rejects.toThrow(`Post with id ${postId} not found`);
      expect(postRepository.findOne).toHaveBeenCalledWith(postId);
      expect(postRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not the author of the post', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValueOnce(existingPost);
      jest.spyOn(postRepository, 'delete');

      const command = new RemovePostCommand(postId, differentUserId);
      const promise = removePostHandler.execute(command);

      await expect(promise).rejects.toThrow('Unauthorized');
      expect(postRepository.findOne).toHaveBeenCalledWith(postId);
      expect(postRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete the post and return it when successful', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValueOnce(existingPost);
      jest.spyOn(postRepository, 'delete').mockResolvedValueOnce(existingPost);

      const command = new RemovePostCommand(postId, userId);
      const result = await removePostHandler.execute(command);

      expect(postRepository.findOne).toHaveBeenCalledWith(postId);
      expect(postRepository.delete).toHaveBeenCalledWith(postId);
      expect(result).toEqual(existingPost);
    });
  });
});
