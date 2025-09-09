import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty({ message: 'Ad boş ola bilməz' })
  @Length(3, 20, { message: 'Ad minimum 3, maksimum 20 simvoldan ibarət olmalıdır' })
  name: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field()
  imageUrl: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'İstifadəçinin identifikasiya nömrəsi boş ola bilməz' })
  userId: number;

}
