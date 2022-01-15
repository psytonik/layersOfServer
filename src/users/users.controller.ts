import { BaseController } from '../common/base.controller';import { NextFunction, Request, Response } from 'express';import { HTTPError } from '../errors/http-error.class';import { inject, injectable } from 'inversify';import { TYPES } from '../types';import { LoggerInterface } from '../logger/logger.interface';import 'reflect-metadata';import { UsersInterface } from './users.interface';import { UserLoginDto } from './dto/user-login.dto';import { UserRegistrationDto } from './dto/user-registration.dto';import { ValidateMiddleware } from '../common/validate.middleware';import { sign } from 'jsonwebtoken';import { ConfigServiceInterface } from '../config/config.service.interface';import { UsersServiceInterface } from './users.service.interface';@injectable()export class UsersController extends BaseController implements UsersInterface {	constructor(		@inject(TYPES.LoggerInterface) private loggerService: LoggerInterface,		@inject(TYPES.UsersService) private usersService: UsersServiceInterface,		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,	) {		super(loggerService);		this.bindRoutes([			{				path: '/registration',				method: 'post',				func: this.registration,				middleware: [new ValidateMiddleware(UserRegistrationDto)],			},			{				path: '/login',				method: 'post',				func: this.login,				middleware: [new ValidateMiddleware(UserLoginDto)],			},		]);	}	async login(		{ body }: Request<{}, {}, UserLoginDto>,		response: Response,		next: NextFunction,	): Promise<void> {		const result = await this.usersService.validateUser(body);		if (!result) {			return next(new HTTPError(401, ' Authorization Failed', 'Login'));		}		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));		this.ok(response, { jwt });	}	async registration(		{ body }: Request<{}, {}, UserRegistrationDto>,		response: Response,		next: NextFunction,	): Promise<void> {		const result = await this.usersService.createUser(body);		if (!result) {			return next(new HTTPError(422, 'User already exists', 'duplicate'));		}		this.ok(response, { email: result.email, id: result.id });		next();	}	private signJWT(email: string, secret: string): Promise<string> {		return new Promise<string>((resolve, reject) => {			sign(				{ email, iat: Math.floor(Date.now() / 1000) },				secret,				{ algorithm: 'HS256' },				(error, token): void => {					if (error) {						return reject(error);					} else {						return resolve(token as string);					}				},			);		});	}}