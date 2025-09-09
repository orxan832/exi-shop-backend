import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';
import { CategoryResolver } from '../resolvers/category.resolver';
import { User } from '../entities/user.entity';
import { SharedModule } from 'src/modules/shared.module';
import { FileService } from 'src/services/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User]), SharedModule],
  providers: [CategoryService, FileService, CategoryResolver],
})
export class CategoryModule { }
