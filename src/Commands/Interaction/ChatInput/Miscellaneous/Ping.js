const Interaction = require('../../../../Structures/Interaction');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'ping',
			description: 'Send a ping request.'
		});
	}

	async run(interaction) {
		return interaction.reply({ content: [
			`***Websocket:*** \`${Math.round(this.client.ws.ping)}ms\``,
			`***Latency:*** \`${Math.round(Date.now() - interaction.createdTimestamp)}ms\``
		].join('\n') });
	}

};
