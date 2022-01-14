import { hash } from 'bcryptjs';

export class UserEntity {
	constructor(private readonly _email: string, private readonly _name: string) {}

	private _password: string;

	get password(): string {
		return this._password;
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}
}
