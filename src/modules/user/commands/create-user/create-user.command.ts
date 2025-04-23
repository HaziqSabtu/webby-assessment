import { createInput } from '../../repositories/user.repository';

export class CreateUserCommand {
  constructor(public readonly input: createInput) {}
}
