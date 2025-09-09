import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length, Matches, Max, MaxLength, Min, Validate } from 'class-validator';
import { CustomPhonePrefixValidation } from 'src/utils/validator';

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsNotEmpty({ message: 'Ad boş ola bilməz' })
  @Length(3, 20, { message: 'Adın uzunluğu 3 simvoldan az olmamalıdır' })
  name: string;

  @Field({ nullable: true })
  @IsNotEmpty({ message: 'Poçt ünvanı boş ola bilməz' })
  @IsEmail({}, { message: 'Poçt ünvanının formatı düzgün deyil' })
  @MaxLength(30, { message: 'Poçt ünvanı 30 simvoldan çox ola bilməz' })
  email: string;

  @Field(() => Int, { nullable: true })
  @IsNotEmpty({ message: 'Poçt ünvanı boş ola bilməz' })
  @Min(18, { message: 'Minimum yaş həddi 18 olmalıdır' })
  @Max(100, { message: 'Maksimum yaş həddi 100 olmalıdır' })
  age: number;

  @Field()
  @IsNotEmpty({ message: 'Mobil nömrə boş ola bilməz' })
  @Length(10, 10, { message: "Mobil nömrə 10 simvoldan ibarət olmalıdır" })
  @Matches(/^\d+$/, { message: "Mobil nömrə ancaq rəqəmlərdən ibarət olmalıdır" })
  @Validate(CustomPhonePrefixValidation, ['010', '050', '051', '055', '070', '077', '099', '060'])
  phoneNumber: string

  @Field(() => Int, { nullable: true })
  @IsNotEmpty({ message: 'Rol boş ola bilməz' })
  roleId: number;

  @Field(() => Boolean, { nullable: true })
  isShop: boolean;

  @Field({ nullable: true })
  blockedDate?: Date;
}
