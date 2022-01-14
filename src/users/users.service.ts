import { UserServiceInterface } from './user.service.interface';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserEntity } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ConfigServiceInterface } from '../config/config.service.interface';

@injectable()
export class UsersService implements UserServiceInterface {
	constructor(@inject(TYPES.ConfigService) private configService: ConfigServiceInterface) {}

	async createUser({ email, password, name }: UserRegistrationDto): Promise<UserEntity | null> {
		const newUser = new UserEntity(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		// check for existing user
		if (!newUser) {
			return null;
		}
		return newUser;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		console.log(dto);
		return true;
	}
}
