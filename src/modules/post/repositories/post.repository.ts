import { Post } from '../entities/post.entity';

export type createInput = {
  title: Post['title'];
  content: Post['content'];
  authorId: Post['authorId'];
};

export type updateInput = {
  title?: Post['title'];
  content?: Post['content'];
};

export abstract class PostRepository {
  abstract create(data: createInput): Promise<Post>;
  abstract findAll(): Promise<Post[]>;
  abstract findOne(id: string): Promise<Post | null>;
  abstract update(id: string, data: updateInput): Promise<Post>;
  abstract delete(id: string): Promise<Post>;
}
