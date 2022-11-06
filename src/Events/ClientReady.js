import Event from '../Structures/Event.js';
import { PrismaClient } from '@prisma/client';
import { redBright, underline } from 'colorette';
import { formatNumber } from '../Structures/Util.js';
const prisma = new PrismaClient();

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'ready',
			once: true
		});
	}

	async run() {
		this.client.logger.log(`Logged in as ${redBright(underline(`${this.client.user.tag}`))}`);
		this.client.logger.log(`Loaded ${formatNumber(this.client.commands.size + this.client.interactions.size)} commands & ${formatNumber(this.client.events.size)} events!`);

		const guilds = this.client.guilds.cache.map(({ id }) => id);
		guilds.forEach(async (id) => {
			const exist = await prisma.guild.findFirst({ where: { id } });
			if (!exist) {
				await prisma.guild.create({ data: { id } });
			}
		});
	}

}
