import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserEntity } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';

export interface UserServiceInterface {
	createUser: (dto: UserRegistrationDto) => Promise<UserEntity | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
