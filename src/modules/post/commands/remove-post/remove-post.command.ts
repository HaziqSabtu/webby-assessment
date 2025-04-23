export class RemovePostCommand {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
  ) {}
}
