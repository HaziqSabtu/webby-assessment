/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { CreatePostHandler } from './create-post.handler';
import { CreatePostCommand } from './create-post.command';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';
import { TagRepository } from '../../repositories/tag.repository';

const createPostInput = {
  title: 'Test Post',
  content: 'This is a test post content',
  authorId: 'userId1',
  tagIds: [],
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
  let tagRepository: TagRepository;

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
        {
          provide: TagRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    createPostHandler = await module.get(CreatePostHandler);
    postRepository = await module.get(PostRepository);
    tagRepository = await module.get(TagRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(createPostHandler).toBeDefined();
    expect(postRepository).toBeDefined();
    expect(tagRepository).toBeDefined();
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

    it('should check if tagIds exist if provided', async () => {
      jest
        .spyOn(tagRepository, 'findAll')
        .mockResolvedValueOnce([{ id: 1, name: 'Test Tag' }]);
      jest.spyOn(postRepository, 'create').mockResolvedValueOnce(createdPost);

      const result = await createPostHandler.execute(
        new CreatePostCommand({
          ...createPostInput,
          tagIds: [1],
        }),
      );

      expect(postRepository.create).toHaveBeenCalledWith(createPostInput);
      expect(result).toEqual(createdPost);
      expect(result.id).toBeDefined();
      expect(result.title).toBe(createPostInput.title);
      expect(result.content).toBe(createPostInput.content);
      expect(result.authorId).toBe(createPostInput.authorId);
    });

    it('should throw BadRequestException if tagIds is provided but tag does not exist', async () => {
      jest
        .spyOn(tagRepository, 'findAll')
        .mockResolvedValueOnce([{ id: 1, name: 'Test Tag' }]);

      const command = new CreatePostCommand({
        ...createPostInput,
        tagIds: [2],
      });
      const promise = createPostHandler.execute(command);

      await expect(promise).rejects.toThrow(`Tag with id 2 does not exist`);
    });
  });
});
