/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStrongPassword', async: false })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string, _args: ValidationArguments) {
    return (
      typeof password === 'string' &&
      /[A-Z]/.test(password) && // uppercase
      /[a-z]/.test(password) && // lowercase
      /[0-9]/.test(password) && // digit
      /[!@#$%^&*]/.test(password) && // symbol
      !/\s/.test(password) && // no whitespace
      password.length >= 8
    );
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Password must be at least 8 characters long, and include uppercase, lowercase, symbols, and digits.';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}
