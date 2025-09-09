import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PaginatedTypeFactory } from 'src/graphql/paginated-type-factory';
import { User } from 'src/models/user.model';

@ObjectType()
export class Category {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field()
  imageUrl: string

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => User)
  user?: User;
}

@ObjectType()
export class PaginatedCategoryType extends PaginatedTypeFactory(Category) { }
