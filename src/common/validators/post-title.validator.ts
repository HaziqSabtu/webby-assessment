/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidPostTitle', async: false })
export class IsValidPostTitleConstraint
  implements ValidatorConstraintInterface
{
  validate(title: string, _args: ValidationArguments): boolean {
    return (
      typeof title === 'string' && title.length >= 5 && title.length <= 100
    );
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Title must be between 5 and 100 characters.';
  }
}

export function IsValidPostTitle(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidPostTitleConstraint,
    });
  };
}
