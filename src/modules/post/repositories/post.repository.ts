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

export type findAllInput = {
  searchText?: string;
  tagId?: number;
  cursor?: string;
  authorId?: string;
  take?: number;
};

export abstract class PostRepository {
  abstract create(data: createInput): Promise<Post>;
  abstract findAll(
    params: findAllInput,
  ): Promise<{ posts: Post[]; nextCursor: string | null }>;
  abstract findOne(id: string): Promise<Post | null>;
  abstract update(id: string, data: updateInput): Promise<Post>;
  abstract delete(id: string): Promise<Post>;

  abstract assignTag(id: string, tagId: number): Promise<Post>;
  abstract removeTag(id: string, tagId: number): Promise<Post>;
}
