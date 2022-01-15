import { UsersServiceInterface } from './users.service.interface';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserEntity } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { UsersRepositoryInterface } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UsersService implements UsersServiceInterface {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepositoryInterface,
	) {}

	async createUser({ email, password, name }: UserRegistrationDto): Promise<UserModel | null> {
		const newUser = new UserEntity(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		// check for existing user
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			const user = new UserEntity(existedUser.email, existedUser.name, existedUser.password);
			return await user.comparePassword(password);
		} else {
			return false;
		}
	}
}
