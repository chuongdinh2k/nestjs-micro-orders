import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique(['email'])
  @Column()
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
