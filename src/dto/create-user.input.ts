import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword, Length, Matches, Max, MaxLength, Min, Validate } from 'class-validator';
import { CustomPhonePrefixValidation } from 'src/utils/validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty({ message: 'Ad boş ola bilməz' })
  @Length(3, 20, { message: 'Ad minimum 3, maksimum 20 simvoldan ibarət olmalıdır' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Poçt ünvanı boş ola bilməz' })
  @IsEmail({}, { message: 'Poçt ünvanının formatı düzgün deyil' })
  @MaxLength(30, { message: 'Poçt ünvanı 30 simvoldan çox ola bilməz' })
  email: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'Yaş boş ola bilməz' })
  @Min(18, { message: 'Minimum yaş həddi 18 olmalıdır' })
  @Max(100, { message: 'Maksimum yaş həddi 100 olmalıdır' })
  age: number;

  @Field()
  @IsNotEmpty({ message: 'Mobil nömrə boş ola bilməz' })
  @Length(10, 10, { message: "Mobil nömrə 10 simvoldan ibarət olmalıdır" })
  @Matches(/^\d+$/, { message: "Mobil nömrə ancaq rəqəmlərdən ibarət olmalıdır" })
  @Validate(CustomPhonePrefixValidation, ['010', '050', '051', '055', '070', '077', '099', '060'])
  phoneNumber: string

  @Field()
  @IsNotEmpty({ message: 'Şifrə boş ola bilməz' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  }, { message: 'Şifrə ən azı 8 simvoldan ibarət olub, tərkibində ən azı 1 kiçik hərf, 1 böyük hərf, 1 rəqəm və 1 xüsusi simvol olmalıdır' })
  password: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'Rol boş ola bilməz' })
  roleId: number;

  @Field(() => Boolean, { defaultValue: false })
  isShop?: boolean;

  @Field({ nullable: true })
  blockedDate?: Date;
}
