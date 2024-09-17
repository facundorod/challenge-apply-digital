import { User } from '@/domain/models/user.model';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  insert(user: User): Promise<void>;
}
