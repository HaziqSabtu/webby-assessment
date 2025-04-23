import { findAllInput } from '../../repositories/post.repository';

export class GetAllPostsQuery {
  constructor(public readonly query: findAllInput) {}
}
