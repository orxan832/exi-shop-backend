import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginationResponse } from '../types/pagination.type';
import { Repository } from 'typeorm';

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    relations: any = {},
    customQuery: any = {},
  ): Promise<PaginationResponse<T>> {
    const { page, limit } = paginationDto;

    const [data, totalData] = await repository.findAndCount({
      where: customQuery,
      relations,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' } as any,
    });

    return {
      data,
      totalData,
      currentPage: page,
      totalPages: Math.ceil(totalData / limit),
      hasPrevious: page > 1,
      hasMore: page * limit < totalData,
    };
  }
}
