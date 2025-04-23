import { updateInput } from '../../repositories/user.repository';

export class UpdateUserCommand {
  constructor(public readonly input: updateInput) {}
}
