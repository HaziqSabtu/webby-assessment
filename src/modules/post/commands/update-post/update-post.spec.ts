/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { UpdatePostHandler } from './update-post.handler';
import { UpdatePostCommand } from './update-post.command';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';

const postId = 'postId1';
const userId = 'userId1';
const differentUserId = 'userId2';

const existingPost: Post = {
  id: postId,
  title: 'Original Post Title',
  content: 'Original post content',
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

const updatePostInput = {
  title: 'Updated Post Title',
  content: 'Updated post content',
};

const updatedPost: Post = {
  ...existingPost,
  title: updatePostInput.title,
  content: updatePostInput.content,
  updatedAt: new Date(),
};

describe('UpdatePostHandler', () => {
  let updatePostHandler: UpdatePostHandler;
  let postRepository: PostRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdatePostHandler,
        {
          provide: PostRepository,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    updatePostHandler = await module.get(UpdatePostHandler);
    postRepository = await module.get(PostRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(updatePostHandler).toBeDefined();
    expect(postRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw an error if post does not exist', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(postRepository, 'update');

      const command = new UpdatePostCommand(postId, userId, updatePostInput);
      const promise = updatePostHandler.execute(command);

      await expect(promise).rejects.toThrow(`Post with id ${postId} not found`);
      expect(postRepository.findOne).toHaveBeenCalledWith(postId);
      expect(postRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not the author of the post', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValueOnce(existingPost);
      jest.spyOn(postRepository, 'update');

      const command = new UpdatePostCommand(
        postId,
        differentUserId,
        updatePostInput,
      );

      const promise = updatePostHandler.execute(command);

      await expect(promise).rejects.toThrow('Unauthorized');
      expect(postRepository.findOne).toHaveBeenCalledWith(postId);
      expect(postRepository.update).not.toHaveBeenCalled();
    });

    it('should update the post and return it when successful', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValueOnce(existingPost);
      jest.spyOn(postRepository, 'update').mockResolvedValueOnce(updatedPost);

      const command = new UpdatePostCommand(postId, userId, updatePostInput);
      const result = await updatePostHandler.execute(command);

      expect(postRepository.findOne).toHaveBeenCalledWith(postId);
      expect(postRepository.update).toHaveBeenCalledWith(
        postId,
        updatePostInput,
      );
      expect(result).toEqual(updatedPost);
      expect(result.title).toBe(updatePostInput.title);
      expect(result.content).toBe(updatePostInput.content);
    });
  });
});
