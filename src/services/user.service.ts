import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from '../dto/create-user.input';
import { PaginationService } from './pagination.service';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginationResponse } from '../types/pagination.type';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly paginationService: PaginationService,
  ) { }

  findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw new HttpException('Xəta baş verdi', HttpStatus.NOT_FOUND)
    }
  }

  async findAllWithPagination(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<User>> {
    try {
      return this.paginationService.paginate(this.userRepository, paginationDto);
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(id: number): Promise<User> {
    try {
      return this.userRepository.findOneBy({ id });
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  findOneWithSoftDeleted(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where({ id })
      .getOne();
  }

  async create(user: CreateUserInput): Promise<User> {
    try {
      validate(user).then(errors => {
        console.log(errors);
      })
      const userExists = await this.userRepository.createQueryBuilder('user').withDeleted().where({ email: user.email }).getOne()
      if (userExists) throw new BadRequestException('Qeyd edilən poçt ünvanı sistemdə mövcuddur');
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = this.userRepository.create({
        ...user,
        password: hashedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);

      throw new BadRequestException(error)
    }
  }

  async update(user: Partial<User>): Promise<void> {
    try {
      await this.userRepository.update(user.id, user);
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.userRepository.softDelete(id);
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
