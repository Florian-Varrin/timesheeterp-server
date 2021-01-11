import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsMultipleOf', async: false })
export class IsMultipleOfConstraint implements ValidatorConstraintInterface {
  public validate(value: number, args: ValidationArguments) {
    const [multiple] = args.constraints;

    return value % multiple === 0;
  }

  public defaultMessage(args: ValidationArguments) {
    const [multiple] = args.constraints;
    return `$property must be a multiple of ${multiple}`;
  }
}

export function IsMultipleOf(
  value: number,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsMultipleOf',
      target: object.constructor,
      propertyName,
      constraints: [value],
      options: validationOptions,
      validator: IsMultipleOfConstraint,
    });
  };
}
