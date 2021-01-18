const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(message, error) {
		switch (error) {
			case 'NotConnected':
				message.channel.send(`You must be connected to a voice channel!`);
				break;
			case 'UnableToJoin':
				message.channel.send(`I can't connect to your voice channel!`);
				break;
			case 'NotPlaying':
				message.channel.send(`No songs are currently playing in this server.`);
				break;
		}
	}

};
