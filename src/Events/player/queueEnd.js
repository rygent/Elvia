const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(player) {
		const channel = await this.client.channels.cache.get(player.textChannel);
		channel.send({ content: 'Queue has ended.' });
		player.destroy();
	}

};
