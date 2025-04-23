import { updateInput } from '../../repositories/post.repository';

export class UpdatePostCommand {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly input: updateInput,
  ) {}
}
