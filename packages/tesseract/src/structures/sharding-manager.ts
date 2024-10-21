import { ShardingManager, type ShardingManagerOptions } from 'discord.js';
import { BaseSettings } from '@/structures/settings.js';

export class BaseShardingManager extends ShardingManager {
	public constructor(file: string, options?: ShardingManagerOptions) {
		super(file, options);

		const settings = new BaseSettings();
		this.token = settings.token;
	}
}
