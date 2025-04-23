/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { CreatePostHandler } from './create-post.handler';
import { CreatePostCommand } from './create-post.command';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';

const createPostInput = {
  title: 'Test Post',
  content: 'This is a test post content',
  authorId: 'userId1',
};

const createdPost: Post = {
  id: 'postId1',
  title: createPostInput.title,
  content: createPostInput.content,
  authorId: createPostInput.authorId,
  tags: [],
  author: {
    id: createPostInput.authorId,
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

describe('CreatePostHandler', () => {
  let createPostHandler: CreatePostHandler;
  let postRepository: PostRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreatePostHandler,
        {
          provide: PostRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    createPostHandler = await module.get(CreatePostHandler);
    postRepository = await module.get(PostRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(createPostHandler).toBeDefined();
    expect(postRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new post and return it', async () => {
      jest.spyOn(postRepository, 'create').mockResolvedValueOnce(createdPost);

      const result = await createPostHandler.execute(
        new CreatePostCommand(createPostInput),
      );

      expect(postRepository.create).toHaveBeenCalledWith(createPostInput);
      expect(result).toEqual(createdPost);
      expect(result.id).toBeDefined();
      expect(result.title).toBe(createPostInput.title);
      expect(result.content).toBe(createPostInput.content);
      expect(result.authorId).toBe(createPostInput.authorId);
    });
  });
});
