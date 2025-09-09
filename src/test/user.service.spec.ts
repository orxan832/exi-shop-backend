import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { mockUserData, mockUserDataWithPagination } from '../mock/user.mock';
import { PaginationService } from '../services/pagination.service';
import { CreateUserInput } from '../dto/create-user.input';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let paginationService: PaginationService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PaginationService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock TypeORM repository
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    paginationService = module.get<PaginationService>(PaginationService)

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should find all users', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue(mockUserData);
    const result = await userService.findAll();

    expect(result).toEqual(mockUserData);
    expect(userRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should create a user', async () => {
    const hashedPassword = 'hashed123';

    // Mock bcrypt.hash
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

    const userData: CreateUserInput = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'pass',
      phoneNumber: '0555136352',
      age: 27,
      roleId: 1,
    };

    const mutatedUserData = {
      ...mockUserData[0],
      ...userData,
      password: hashedPassword,
    };

    jest.spyOn(userRepository, 'create').mockReturnValueOnce(mutatedUserData);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mutatedUserData);

    const result = await userService.create(userData);

    // Verify calls
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ ...userData, password: hashedPassword }),
    );
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ ...userData, password: hashedPassword }),
    );

    // Verify the result
    expect(result).toEqual(mutatedUserData);
  });

  it('should find user by id', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUserData[0])

    const result = await userService.findOne(1)
    expect(result).toEqual(mockUserData[0])
    expect(userRepository.findOneBy).toHaveBeenCalledTimes(1)
  })

  it('should find all data with pagination', async () => {
    jest.spyOn(paginationService, 'paginate').mockResolvedValue(mockUserDataWithPagination)
    const result = await paginationService.paginate(userRepository, { limit: 10, page: 1 })
    expect(result).toEqual(mockUserDataWithPagination)
    expect(paginationService.paginate).toHaveBeenCalledWith(userRepository, { page: 1, limit: 10 })
  })

  it('should update user', async () => {
    jest.spyOn(userRepository, 'update').mockResolvedValue(undefined)
    const userData: CreateUserInput = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'pass',
      phoneNumber: '0555136352',
      age: 27,
      roleId: 1,
    };

    await userService.update(userData)

    expect(userRepository.update).toHaveBeenCalledTimes(1)

  })

  it('should remove user', async () => {
    jest.spyOn(userRepository, 'softDelete').mockResolvedValue(undefined)
    await userService.remove(1)
    expect(userRepository.softDelete).toHaveBeenCalledTimes(1)
  })

});
