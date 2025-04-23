import { createInput } from '../../repositories/post.repository';

export class CreatePostCommand {
  constructor(public readonly input: createInput) {}
}
