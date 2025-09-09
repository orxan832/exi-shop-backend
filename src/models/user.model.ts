import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'src/models/category.model';
import { PaginatedTypeFactory } from '../graphql/paginated-type-factory';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Int)
  age: number;

  // Exclude password from GraphQL schema for security reasons
  // Password field will remain in the database but not exposed in the schema

  @Field()
  phoneNumber: string

  @Field(() => Int)
  roleId: number;

  @Field(() => Boolean)
  isShop: boolean;

  @Field({ nullable: true })
  blockedDate?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}

@ObjectType()
export class PaginatedUserType extends PaginatedTypeFactory(User) { }
