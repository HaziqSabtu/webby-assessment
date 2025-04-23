/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { GetAllPostsHandler } from './get-all-posts.handler';
import { GetAllPostsQuery } from './get-all-posts.query';
import { PostRepository } from '../../repositories/post.repository';
import { PostPagination } from '../../entities/post-pagination.entity';
import { Post } from '../../entities/post.entity';

const mockPosts: Post[] = [
  {
    id: 'postId1',
    title: 'First Test Post',
    content: 'Content of first test post',
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
  },
  {
    id: 'postId2',
    title: 'Second Test Post',
    content: 'Content of second test post',
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
  },
];

const mockQuery = {};

const mockPagination: PostPagination = {
  posts: mockPosts,
  nextCursor: 'cursor123',
};

describe('GetAllPostsHandler', () => {
  let getAllPostsHandler: GetAllPostsHandler;
  let postRepository: PostRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetAllPostsHandler,
        {
          provide: PostRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    getAllPostsHandler = await module.get(GetAllPostsHandler);
    postRepository = await module.get(PostRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(getAllPostsHandler).toBeDefined();
    expect(postRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should return paginated posts', async () => {
      jest
        .spyOn(postRepository, 'findAll')
        .mockResolvedValueOnce(mockPagination);

      const query = new GetAllPostsQuery(mockQuery);
      const result = await getAllPostsHandler.execute(query);

      expect(postRepository.findAll).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual(mockPagination);
      expect(result.posts).toHaveLength(2);
    });

    it('should handle empty results', async () => {
      const emptyPagination: PostPagination = {
        posts: [],
        nextCursor: null,
      };

      jest
        .spyOn(postRepository, 'findAll')
        .mockResolvedValueOnce(emptyPagination);

      const query = new GetAllPostsQuery(mockQuery);
      const result = await getAllPostsHandler.execute(query);

      expect(postRepository.findAll).toHaveBeenCalledWith(mockQuery);
      expect(result.posts).toEqual([]);
    });
  });
});
