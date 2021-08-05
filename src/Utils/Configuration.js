module.exports = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.DISCORD_PREFIX,
	owner: process.env.DISCORD_OWNER,
	defaultPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
	mongoUri: process.env.MONGO_URI,
	Access: {
		INVITE_CODE: process.env.INVITE_CODE,
		INVITE_PERMISSION: process.env.INVITE_PERMISSION,
		INVITE_SCOPE: process.env.INVITE_SCOPE.split(',').join('%20'),
		WEBHOOK_ID: process.env.WEBHOOK_ID,
		WEBHOOK_TOKEN: process.env.WEBHOOK_TOKEN
	},
	Color: require('../../assets/json/Color.json'),
	Emoji: {
		ONLINE: '<:online:712397262256472075>',
		IDLE: '<:idle:712397201955094708>',
		DND: '<:dnd:712397154836283392>',
		OFFLINE: '<:offline:712397086100029440>',
		BOT: '<:bot:729455298917564467>',
		SPOTIFY: '<:spotify:859713717595144233>'
	},
	Environment: {
		IMDB: process.env.IMDB_KEY,
		OPEN_WEATHER_ID: process.env.OPEN_WEATHER_ID,
		SPOTIFY_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
		YOUTUBE: process.env.YOUTUBE_KEY
	}
};
