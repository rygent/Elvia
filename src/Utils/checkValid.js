const { Access, Api } = require('./Setting.js');

module.exports = class checkValid {

	constructor(client) {
		this.client = client;
	}

	validate() {
		if (!Access.InviteCode) {
			this.client.logger.log({ content: 'Guild invite code required!', type: 'warn' });
		}

		if (!Access.WebhookURL) {
			this.client.logger.log({ content: 'Webhook URL required to send client logs!', type: 'warn' });
		}

		if (!Api.Imdb) {
			this.client.logger.log({ content: 'IMDb API key required for "imdb" command!', type: 'warn' });
		}

		if (!Api.OpenWeatherMap) {
			this.client.logger.log({ content: 'Open Weather Map API key required for "weather" command!', type: 'warn' });
		}

		if (!Api.Spotify.ClientId || !Api.Spotify.ClientSecret) {
			this.client.logger.log({ content: 'Spotify Client ID & Client Secret required for "spotify" command!', type: 'warn' });
		}

		if (!Api.Youtube) {
			this.client.logger.log({ content: 'YouTube API key required for "youtube" command!', type: 'warn' });
		}
	}

};
