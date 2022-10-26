import Event from '../Structures/Event.js';
import { PrismaClient } from '@prisma/client';
import * as Colorette from 'colorette';
const prisma = new PrismaClient();

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'ready',
			once: true
		});
	}

	async run() {
		this.client.logger.log(`Logged in as ${Colorette.redBright(`${this.client.user.tag}`)}`);
		this.client.logger.log(`Loaded ${(this.client.commands.size + this.client.interactions.size).formatNumber()} commands & ${this.client.events.size.formatNumber()} events!`);

		const guilds = this.client.guilds.cache.map(({ id }) => id);
		guilds.forEach(async (id) => {
			const exist = await prisma.guild.findFirst({ where: { guildId: id } });
			if (!exist) {
				await prisma.guild.create({ data: { guildId: id } });
			}
		});
	}

}
