import { ShardingManager, type ShardingManagerOptions } from 'discord.js';
import { TesseractSettings } from '@/lib/structures/TesseractSettings.js';

export class TesseractShardingManager extends ShardingManager {
	public constructor(file: string, options?: ShardingManagerOptions) {
		super(file, options);

		const settings = new TesseractSettings();
		this.token = settings.token;
	}
}
