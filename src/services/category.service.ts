import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryInput } from '../dto/create-category.input';
import { User } from '../entities/user.entity';
import { PaginationService } from 'src/services/pagination.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { PaginationResponse } from 'src/types/pagination.type';
import { FileService } from './file.service';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly paginationService: PaginationService,
    private readonly fileService: FileService
  ) { }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findAllWithPagination(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Category>> {
    const response = await this.paginationService.paginate(
      this.categoryRepository,
      paginationDto,
      { user: true }
    );
    return { ...response, data: response.data.map(item => ({ ...item, imageUrl: item.imageUrl.slice(11) })) }
  }

  async findOne(id: number): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id }, relations: { user: true } });
      if (!category) throw new NotFoundException('Kateqoriya tapılmadı')
      const imageBase64 = await this.fileService.getFileBase64(category.imageUrl)
      return { ...category, imageUrl: imageBase64 }
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  findOneWithSoftDeleted(id: number): Promise<Category> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .withDeleted()
      .where({ id })
      .getOne();
  }

  async create(category: CreateCategoryInput, file: FileUpload): Promise<Category> {
    let imageUrl: string;
    console.log(file)
    try {
      const isCategoryExisted = this.categoryRepository.existsBy({ name: category.name })
      const user = this.userRepository.findOne({ where: { id: category.userId } })

      const [isCategoryExistedPromise, userPromise] = await Promise.all([isCategoryExisted, user])

      if (isCategoryExistedPromise) throw new HttpException('Bu adda kateqoriya mövcuddur', HttpStatus.NOT_FOUND)
      if (!userPromise) throw new HttpException(`Kateqoriyaya uyğun olaraq daxil etdiyiniz istifadəçi məlumatı tapılmadı`, HttpStatus.NOT_FOUND);

      imageUrl = await this.fileService.uploadFile(file)
      if (imageUrl) {
        const responseData = this.categoryRepository.create({
          ...category,
          imageUrl,
          user: userPromise,
        });

        return this.categoryRepository.save(responseData);
      }
    } catch (err) {
      if (imageUrl) await this.fileService.deleteFile(imageUrl)
      throw new BadRequestException(err)
    }
  }

  async update(id: number, category: Partial<Category>): Promise<void> {
    await this.categoryRepository.update(id, category);
  }

  async remove(id: number): Promise<void> {
    try {
      await this.categoryRepository.softDelete(id);
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
