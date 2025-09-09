import { User } from '../entities/user.entity';

export const mockUserData: User[] = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    age: 27,
    roleId: 1,
    isShop: false,
    password: 'pass',
    phoneNumber: '0555136352',
    blockedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    categories: [],
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@example.com',
    age: 27,
    roleId: 1,
    isShop: false,
    password: 'pass',
    phoneNumber: '0555136352',
    blockedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    categories: [],
  },
];


export const mockUserDataWithPagination = {
  data: mockUserData,
  totalData: 2,
  currentPage: 1,
  totalPages: 1,
  hasPrevious: false,
  hasMore: false,
}