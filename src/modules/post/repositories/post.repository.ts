import { Post } from '../entities/post.entity';

export abstract class PostRepository {
  abstract findAll(): Promise<Post[]>;
}
