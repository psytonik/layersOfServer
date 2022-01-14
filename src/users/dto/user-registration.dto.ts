import { IsEmail, IsString } from 'class-validator';

export class UserRegistrationDto {
	@IsEmail({}, { message: 'Wrong email address' })
	email: string;

	@IsString({ message: 'Password is empty' })
	password: string;

	@IsString({ message: 'Name is empty' })
	name: string;
}
