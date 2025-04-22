import { Tag } from '../entities/tag.entity';

export abstract class TagRepository {
  abstract findAll(): Promise<Tag[]>;
}
