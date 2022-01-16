import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './middleware.interface';

export class AuthGuard implements MiddlewareInterface {
	execute(request: Request, res: Response, next: NextFunction): void {
		if (request.user) {
			return next();
		}
		res.status(401).send({ error: 'You are not authorized.' });
	}
}
