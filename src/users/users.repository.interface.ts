import { UserModel } from '@prisma/client';
import { UserEntity } from './user.entity';

export interface UsersRepositoryInterface {
	create: (user: UserEntity) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
	delete: (email: string) => Promise<UserModel | null>;
	edit: (email: string) => Promise<UserModel | null>;
}
