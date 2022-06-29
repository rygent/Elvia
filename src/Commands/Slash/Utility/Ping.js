import Command from '../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['ping'],
			description: 'Send a ping request.'
		});
	}

	async run(interaction) {
		const content = [
			`***Websocket:*** \`${Math.round(this.client.ws.ping)}ms\``,
			`***Latency:*** \`${Math.round(Date.now() - interaction.createdTimestamp)}ms\``
		].join('\n');

		return interaction.reply({ content });
	}

}
