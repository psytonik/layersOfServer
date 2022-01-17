import express, { Express } from 'express';import { Server } from 'http';import 'reflect-metadata';import { LoggerInterface } from './logger/logger.interface';import { inject, injectable } from 'inversify';import { TYPES } from './types';import { json } from 'body-parser';import { ConfigServiceInterface } from './config/config.service.interface';import { ExceptionFilterInterface } from './errors/exception.filter.interface';import { UsersController } from './users/users.controller';import { PrismaService } from './database/prisma.service';import { AuthMiddleware } from './common/auth.middleware';@injectable()export class App {	app: Express;	PORT: number;	server: Server;	HOST = 'localhost';	constructor(		@inject(TYPES.LoggerInterface) private logger: LoggerInterface,		@inject(TYPES.UsersController) private userController: UsersController,		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilterInterface,		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,		@inject(TYPES.PrismaService) private prismaService: PrismaService,	) {		this.app = express();		this.PORT = 8000;	}	useMiddleware(): void {		this.app.use(json());		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));		this.app.use(authMiddleware.execute.bind(authMiddleware));	}	useRoutes(): void {		this.app.use('/users', this.userController.router);	}	useExceptionFilters(): void {		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));	}	public async init(): Promise<void> {		await this.prismaService.connect();		this.useMiddleware();		this.useRoutes();		this.useExceptionFilters();		this.server = this.app.listen(this.PORT);		this.logger.log(`[App] server run on https://${this.HOST}:${this.PORT}`);	}	public close(): void {		this.server.close();	}}