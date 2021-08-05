module.exports = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.DISCORD_PREFIX,
	owner: process.env.DISCORD_OWNER,
	defaultPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
	mongoUri: process.env.MONGO_URI,
	Access: {
		INVITE_CODE: process.env.INVITE_CODE,
		INVITE_PERMISSION: 2013654135,
		INVITE_SCOPE: ['bot', 'applications.commands'],
		WEBHOOK_ID: process.env.WEBHOOK_ID,
		WEBHOOK_TOKEN: process.env.WEBHOOK_TOKEN
	},
	Color: require('../../assets/json/Color.json'),
	Emoji: require('../../assets/json/Emoji.json'),
	Environment: {
		IMDB: process.env.IMDB_KEY,
		OPEN_WEATHER_ID: process.env.OPEN_WEATHER_ID,
		SPOTIFY_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
		YOUTUBE: process.env.YOUTUBE_KEY
	}
};
