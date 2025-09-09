import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from '../services/category.service';
import { Category, PaginatedCategoryType } from '../models/category.model';
import { CreateCategoryInput } from '../dto/create-category.input';
import { UpdateCategory } from '../dto/update-category.input';
import { PaginationDto } from '../dto/pagination.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { FileValidationPipe } from 'src/utils/validation-error';
import { BadRequestException, UsePipes } from '@nestjs/common';
import { streamToBuffer } from 'src/utils/helper';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService
  ) { }

  @Query(() => [Category])
  findAllCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Query(() => PaginatedCategoryType)
  async findAllCategoriesWithPagination(
    @Args('page', { type: () => Int, nullable: false }) page: number,
    @Args('limit', { type: () => Int, nullable: false }) limit: number,
  ) {
    const paginationDto: PaginationDto = { page, limit };
    return this.categoryService.findAllWithPagination(paginationDto);
  }

  @Query(() => Category)
  findCategoryById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Query(() => Category)
  findSoftDeletedCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    return this.categoryService.findOneWithSoftDeleted(id);
  }

  @Mutation(() => Category)
  // @UsePipes(new FileValidationPipe())
  async createCategory(
    @Args('data') createCategoryInput: CreateCategoryInput,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<Category> {
    try {
      console.log(file)
      const { mimetype, createReadStream } = file;

      // Validate MIME type
      const allowedMimeTypes = ['image/jpeg', 'image/png'];
      if (!allowedMimeTypes.includes(mimetype)) {
        throw new BadRequestException('Invalid file type. Only JPEG and PNG are allowed');
      }

      // Validate file size
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      const fileStream = createReadStream();

      const fileBuffer = await streamToBuffer(fileStream)

      if (fileBuffer.length > MAX_FILE_SIZE) {
        fileStream.destroy()
        throw new BadRequestException('File size exceeds the limit of 5MB');
      } else {
        return this.categoryService.create(createCategoryInput, file)
      }
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  @Mutation(() => Boolean)
  async updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') updateCategoryInput: UpdateCategory,
  ): Promise<boolean> {
    await this.categoryService.update(id, updateCategoryInput);
    return true;
  }

  @Mutation(() => Boolean)
  async removeCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.categoryService.update(id, { deletedAt: new Date() });
    return true;
  }
}
