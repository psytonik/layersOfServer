import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.LoggerInterface) private logger: LoggerInterface) {
		this.client = new PrismaClient();
	}
	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] DB Connected');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(`[PrismaService] something went wrong => ${e.message}`);
			}
		}
	}
	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
