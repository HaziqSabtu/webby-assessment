import { createInput } from '../../repositories/tag.repository';

export class CreateTagCommand {
  constructor(public readonly input: createInput) {}
}
