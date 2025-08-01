import { ShardingManager, type ShardingManagerOptions } from 'discord.js';
import { CoreSettings } from '@/lib/settings.js';

export class CoreShardingManager extends ShardingManager {
	public constructor(file: string, options?: ShardingManagerOptions) {
		super(file, options);

		const settings = new CoreSettings();
		if (settings.token) this.token = settings.token;
	}
}
