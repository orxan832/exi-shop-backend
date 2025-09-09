import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ name: "CustomPhonePrefixValidation", async: false })
export class CustomPhonePrefixValidation implements ValidatorConstraintInterface {
    validate(phoneNumber: string, args: ValidationArguments) {
        const allowedPrefixes = args.constraints;
        const prefix = phoneNumber.substring(0, 3);
        return allowedPrefixes.includes(prefix);
    }

    defaultMessage(args: ValidationArguments) {
        return `Mobil mömrənin prefiksi aşağıdakılardan biri olmalıdır: ${args.constraints.join(', ')}`;
    }
}