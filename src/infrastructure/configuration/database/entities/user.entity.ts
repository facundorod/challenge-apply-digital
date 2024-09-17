import { User } from '@/domain/models/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserTypeOrmEntity {
  @PrimaryGeneratedColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  surname: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  public convertToUserModel(): User {
    return new User(
      this.userId,
      this.name,
      this.email,
      this.password,
      this.surname,
    );
  }

  public convertToUserEntity(user: User): void {
    this.userId = user.getUserId();
    this.name = user.getName();
    this.surname = user.getSurname();
    this.email = user.getEmail();
    this.password = user.getPassword();
  }
}
