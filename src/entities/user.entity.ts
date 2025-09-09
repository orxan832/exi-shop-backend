import { Category } from '../entities/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, length: 30 })
  email: string;

  @Column({ type: 'smallint', unsigned: true })
  age: number;

  @Column({ select: false })
  password: string;

  @Column({ length: 10 })
  phoneNumber: string

  @Column()
  roleId: number;

  @Column({ default: false })
  isShop: boolean;

  @Column({ nullable: true })
  blockedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];
}
