const { Access, Environment } = require('../Utils/Configuration.js');

module.exports = class checkValid {

	constructor(client) {
		this.client = client;
	}

	validate() {
		if (!Access.INVITE_CODE) {
			this.client.logger.log({ content: 'Guild invite code required!', type: 'warn' });
		}

		if (!Access.INVITE_PERMISSION || !Access.INVITE_SCOPE) {
			this.client.logger.log({ content: 'Invite permission & scope required for "invite" command!', type: 'warn' });
		}

		if (!Environment.IMDB) {
			this.client.logger.log({ content: 'IMDb API key required for "imdb" command!', type: 'warn' });
		}

		if (!Environment.OPEN_WEATHER_ID) {
			this.client.logger.log({ content: 'Open Weather Map API key required for "weather" command!', type: 'warn' });
		}

		if (!Environment.SPOTIFY_ID || !Environment.SPOTIFY_SECRET) {
			this.client.logger.log({ content: 'Spotify Client ID & Client Secret required for "spotify" command!', type: 'warn' });
		}

		if (!Access.WEBHOOK_ID || !Access.WEBHOOK_TOKEN) {
			this.client.logger.log({ content: 'Webhook ID & Token required to send client logs!', type: 'warn' });
		}

		if (!Environment.YOUTUBE) {
			this.client.logger.log({ content: 'YouTube API key required for "youtube" command!', type: 'warn' });
		}
	}

};
