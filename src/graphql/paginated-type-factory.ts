import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export function PaginatedTypeFactory<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedTypeClass {
    @Field(() => [classRef])
    data: T[];

    @Field(() => Number)
    totalData: number;

    @Field(() => Number)
    currentPage: number;

    @Field(() => Number)
    totalPages: number;

    @Field(() => Boolean)
    hasPrevious: boolean;

    @Field(() => Boolean)
    hasMore: boolean;
  }

  return PaginatedTypeClass;
}
