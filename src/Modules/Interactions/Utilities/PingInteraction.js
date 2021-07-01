const Interaction = require('../../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'ping',
			description: 'Shows Bot latency & API response time.'
		});
	}

	async run(interaction) {
		const latency = Math.round(Date.now() - interaction.createdTimestamp);

		if (latency < 0) {
			return interaction.reply({ content: 'Please try again later!', ephemeral: true });
		} else {
			return interaction.reply({ content: [
				`💓 ***Heartbeat:*** \`${Math.round(this.client.ws.ping)}ms\``,
				`⏱️ ***Latency:*** \`${latency}ms\``
			].join('\n'), ephemeral: true });
		}
	}

};
