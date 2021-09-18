module.exports = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.CLIENT_PREFIX,
	applicationId: process.env.CLIENT_ID,
	owners: process.env.CLIENT_OWNERS.split(','),
	defaultPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
	mongoURL: process.env.MONGODB_URL,
	Access: {
		InviteCode: process.env.INVITE_CODE,
		InvitePermission: 2013654135,
		InviteScope: ['bot', 'applications.commands'],
		WebhookURL: process.env.WEBHOOK_URL
	},
	Api: {
		Imdb: process.env.IMDB_API,
		OpenWeatherMap: process.env.OPEN_WEATHER_MAP_API,
		Spotify: {
			ClientId: process.env.SPOTIFY_CLIENT_ID,
			ClientSecret: process.env.SPOTIFY_CLIENT_SECRET
		},
		Youtube: process.env.YOUTUBE_API
	},
	Color: require('../../assets/json/Color.json'),
	Emoji: require('../../assets/json/Emoji.json')
};
