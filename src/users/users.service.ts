import { UserServiceInterface } from './user.service.interface';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserEntity } from './user.entity';
import { injectable } from 'inversify';

@injectable()
export class UsersService implements UserServiceInterface {
	async createUser({ email, password, name }: UserRegistrationDto): Promise<UserEntity | null> {
		const newUser = new UserEntity(email, name);
		await newUser.setPassword(password);
		// check for existing user
		return newUser;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		console.log(dto);
		return true;
	}
}
