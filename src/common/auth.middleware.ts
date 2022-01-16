import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { MiddlewareInterface } from './middleware.interface';

export class AuthMiddleware implements MiddlewareInterface {
	constructor(private secret: string) {}

	execute(request: Request, res: Response, next: NextFunction): void {
		if (request.headers.authorization) {
			verify(request.headers.authorization.split(' ')[1], this.secret, (error, payload) => {
				if (error) {
					next();
				} else if (payload) {
					request.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
