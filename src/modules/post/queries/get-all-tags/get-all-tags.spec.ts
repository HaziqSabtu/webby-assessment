/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { GetAllTagsHandler } from './get-all-tags.handler';
import { TagRepository } from '../../repositories/tag.repository';
import { Tag } from '../../entities/tag.entity';

const mockTags: Tag[] = [
  {
    id: 1,
    name: 'JavaScript',
  },
  {
    id: 2,
    name: 'TypeScript',
  },
  {
    id: 3,
    name: 'NestJS',
  },
];

describe('GetAllTagsHandler', () => {
  let getAllTagsHandler: GetAllTagsHandler;
  let tagRepository: TagRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetAllTagsHandler,
        {
          provide: TagRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    getAllTagsHandler = await module.get(GetAllTagsHandler);
    tagRepository = await module.get(TagRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(getAllTagsHandler).toBeDefined();
    expect(tagRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should return all tags', async () => {
      jest.spyOn(tagRepository, 'findAll').mockResolvedValueOnce(mockTags);

      const result = await getAllTagsHandler.execute();

      expect(tagRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTags);
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('JavaScript');
      expect(result[1].name).toBe('TypeScript');
      expect(result[2].name).toBe('NestJS');
    });

    it('should handle empty results', async () => {
      jest.spyOn(tagRepository, 'findAll').mockResolvedValueOnce([]);

      const result = await getAllTagsHandler.execute();

      expect(tagRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
