import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { UserEntity } from './user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';
import { TYPES } from '../types';
import { LoggerInterface } from '../logger/logger.interface';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class UsersRepository implements UsersRepositoryInterface {
	constructor(
		@inject(TYPES.LoggerInterface) private logger: LoggerInterface,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {}

	async create({ email, password, name }: UserEntity): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: { email, password, name },
		});
	}
	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: { email },
		});
	}
	edit: (email: string) => Promise<UserModel | null>;
	delete: (email: string) => Promise<UserModel | null>;
}
