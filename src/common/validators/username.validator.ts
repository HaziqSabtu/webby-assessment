/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidUsername', async: false })
export class IsValidUsernameConstraint implements ValidatorConstraintInterface {
  validate(username: unknown, _args: ValidationArguments): boolean {
    return (
      typeof username === 'string' &&
      /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/.test(username) // starts with letter, 3-30 chars
    );
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Username must start with a letter, contain only letters, numbers, and underscores, and be 3–30 characters long.';
  }
}

export function IsValidUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidUsernameConstraint,
    });
  };
}
