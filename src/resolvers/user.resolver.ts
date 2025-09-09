import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { PaginatedUserType, User } from '../models/user.model';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { PaginationDto } from '../dto/pagination.dto';
import { ValidationPipe } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query(() => [User])
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => PaginatedUserType)
  async findAllUsersWithPagination(
    @Args('page', { type: () => Int, nullable: false }) page: number,
    @Args('limit', { type: () => Int, nullable: false }) limit: number,
  ) {
    const paginationDto: PaginationDto = { page, limit };
    return this.userService.findAllWithPagination(paginationDto);
  }

  @Query(() => User)
  async findUserById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => User)
  async findSoftDeletedUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return this.userService.findOneWithSoftDeleted(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('data', new ValidationPipe()) createUserInput: CreateUserInput,
  ): Promise<User> {
    try {
      return this.userService.create(createUserInput);
    } catch (err) {
      console.log(err);
    }
  }

  @Mutation(() => Boolean)
  async updateUser(
    @Args('data') user: UpdateUserInput,
  ): Promise<boolean> {
    try {
      await this.userService.update(user);
      return true;
    } catch (err) {
      console.log(err);

    }
  }

  @Mutation(() => Boolean)
  async removeUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.userService.remove(id);
    return true;
  }
}
