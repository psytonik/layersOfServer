import express, { Express } from 'express';import { Server } from 'http';import 'reflect-metadata';import { UsersController } from './users/users.controller';import { ExceptionFilter } from './errors/exception.filter';import { LoggerInterface } from './logger/logger.interface';import { inject, injectable } from 'inversify';import { TYPES } from './types';@injectable()export class App {	app: Express;	PORT: number;	server: Server;	HOST = 'localhost';	constructor(		@inject(TYPES.LoggerInterface) private logger: LoggerInterface,		@inject(TYPES.UsersController) private userController: UsersController,		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,	) {		this.app = express();		this.PORT = 8000;	}	useRoutes(): void {		this.app.use('/users', this.userController.router);	}	useExceptionFilters(): void {		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));	}	public async init(): Promise<void> {		this.useRoutes();		this.useExceptionFilters();		this.server = this.app.listen(this.PORT);		this.logger.log(`server run on https://${this.HOST}:${this.PORT}`);	}}