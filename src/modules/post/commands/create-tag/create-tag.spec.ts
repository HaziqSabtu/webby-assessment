/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { CreateTagCommand } from './create-tag.command';
import { CreateTagHandler } from './create-tag.handler';
import { TagRepository } from '../../repositories/tag.repository';
import { Tag } from '../../entities/tag.entity';
import { ConflictException } from '@nestjs/common';

describe('CreateTagHandler', () => {
  let createTagHandler: CreateTagHandler;
  let tagRepository: TagRepository;

  const tagInput = {
    name: 'Test Tag',
  };

  const mockTag1 = {
    id: 1,
    name: 'Test Tag',
    description: 'This is a test tag',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Tag;

  const mockTag2 = {
    id: 2,
    name: 'Test Tag 2',
    description: 'This is a test tag 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateTagHandler,
        {
          provide: TagRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    createTagHandler = module.get<CreateTagHandler>(CreateTagHandler);
    tagRepository = module.get<TagRepository>(TagRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createTagHandler).toBeDefined();
    expect(tagRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should create and return a new tag', async () => {
      jest.spyOn(tagRepository, 'create').mockResolvedValue(mockTag1);
      jest.spyOn(tagRepository, 'findAll').mockResolvedValueOnce([mockTag2]);

      const command = new CreateTagCommand(tagInput);
      const result = await createTagHandler.execute(command);

      expect(tagRepository.create).toHaveBeenCalledWith(tagInput);
      expect(result).toEqual(mockTag1);
      expect(result.id).toBe(1);
      expect(result.name).toBe(tagInput.name);
    });

    it('should throw ConflictException if tag name already exists', async () => {
      jest.spyOn(tagRepository, 'create').mockResolvedValue(mockTag1);
      jest.spyOn(tagRepository, 'findAll').mockResolvedValueOnce([mockTag1]);

      const command = new CreateTagCommand(tagInput);
      const promise = createTagHandler.execute(command);

      await expect(promise).rejects.toThrow(ConflictException);
      expect(tagRepository.create).not.toHaveBeenCalled();
      expect(tagRepository.findAll).toHaveBeenCalled();
    });
  });
});
