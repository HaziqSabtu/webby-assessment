/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidPostContent', async: false })
export class IsValidPostContentConstraint
  implements ValidatorConstraintInterface
{
  validate(content: unknown, _args: ValidationArguments): boolean {
    return typeof content === 'string' && content.trim().length > 0;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Content must be a non-empty string.';
  }
}

export function IsValidPostContent(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidPostContentConstraint,
    });
  };
}
