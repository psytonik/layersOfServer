import { UserModel } from '@prisma/client';
import 'reflect-metadata';
import { Container } from 'inversify';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserEntity } from './user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';
import { UsersService } from './users.service';
import { UsersServiceInterface } from './users.service.interface';

const ConfigServiceMock: ConfigServiceInterface = {
	get: jest.fn(),
};
const UsersRepositoryMock: UsersRepositoryInterface = {
	find: jest.fn(),
	create: jest.fn(),
	delete: jest.fn(),
	edit: jest.fn(),
};
const container = new Container();
let configService: ConfigServiceInterface;
let userRepository: UsersRepositoryInterface;
let userService: UsersServiceInterface;

beforeAll(() => {
	container.bind<UsersServiceInterface>(TYPES.UsersService).to(UsersService);
	container.bind<ConfigServiceInterface>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container
		.bind<UsersRepositoryInterface>(TYPES.UsersRepository)
		.toConstantValue(UsersRepositoryMock);

	configService = container.get<ConfigServiceInterface>(TYPES.ConfigService);
	userRepository = container.get<UsersRepositoryInterface>(TYPES.UsersRepository);
	userService = container.get<UsersServiceInterface>(TYPES.UsersService);
});

let createdUser: UserModel | null;
describe('UserService', (): void => {
	it('createUser', async (): Promise<void> => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		userRepository.create = jest.fn().mockImplementationOnce(
			(user: UserEntity): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await userService.createUser({
			email: 'psytonik@icloud.com',
			name: 'Anthony',
			password: 'qazxsw1234',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.email).toContain('@');
		expect(createdUser?.name).not.toContain('@');
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async (): Promise<void> => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await userService.validateUser({
			email: 'psytonik@icloud.com',
			password: 'qazxsw1234',
		});
		expect(result).toBeTruthy();
	});

	it('validateUser - wrong password', async (): Promise<void> => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await userService.validateUser({
			email: 'psytonik@icloud.com',
			password: 'qazxsw',
		});
		expect(result).toBeFalsy();
	});

	it('validateUser - wrong user', async (): Promise<void> => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await userService.validateUser({
			email: 'psytonik22@icloud.com',
			password: 'qazxsw',
		});
		expect(result).toBeFalsy();
	});
});
