/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { GetPostByIdHandler } from './get-post-by-id.handler';
import { GetPostByIdQuery } from './get-post-by-id.query';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';
import { NotFoundException } from '@nestjs/common';

const postId = 'postId1';

const mockPost: Post = {
  id: postId,
  title: 'Test Post',
  content: 'This is a test post content',
  authorId: 'userId1',
  tags: [],
  author: {
    id: 'userId1',
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

describe('GetPostByIdHandler', () => {
  let getPostByIdHandler: GetPostByIdHandler;
  let postRepository: PostRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPostByIdHandler,
        {
          provide: PostRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    getPostByIdHandler = await module.get(GetPostByIdHandler);
    postRepository = await module.get(PostRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(getPostByIdHandler).toBeDefined();
    expect(postRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should return a post when it exists', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValueOnce(mockPost);

      const query = new GetPostByIdQuery(postId);
      const result = await getPostByIdHandler.execute(query);

      expect(postRepository.findOne).toHaveBeenCalledWith(postId);
      expect(result).toEqual(mockPost);
      expect(result.id).toBe(postId);
      expect(result.title).toBe(mockPost.title);
      expect(result.content).toBe(mockPost.content);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValueOnce(null);

      const query = new GetPostByIdQuery(postId);
      const promise = getPostByIdHandler.execute(query);

      await expect(promise).rejects.toThrow(NotFoundException);
      await expect(promise).rejects.toThrow(`Post with id ${postId} not found`);
      expect(postRepository.findOne).toHaveBeenCalledWith(postId);
    });
  });
});
