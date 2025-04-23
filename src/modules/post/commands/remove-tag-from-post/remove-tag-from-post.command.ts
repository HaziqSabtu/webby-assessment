export class RemoveTagFromPostCommand {
  constructor(
    public readonly postId: string,
    public readonly tagId: number,
    public readonly userId: string,
  ) {}
}
