import { Tag } from '../entities/tag.entity';

export type createInput = {
  name: Tag['name'];
};
export abstract class TagRepository {
  abstract create(createInput: createInput): Promise<Tag>;
  abstract findAll(): Promise<Tag[]>;
}
