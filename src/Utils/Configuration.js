module.exports = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.DISCORD_PREFIX,
	owner: process.env.DISCORD_OWNER,
	defaultPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
	mongoUri: process.env.MONGO_URI,
	Access: {
		INVITE_CODE: process.env.INVITE_CODE,
		INVITE_PERMISSION: process.env.INVITE_PERMISSION,
		INVITE_SCOPE: process.env.INVITE_SCOPE.split(',').join('%20')
	},
	Color: {
		DEFAULT: '2f3136',
		GREEN: '2ecc71',
		YELLOW: 'ffff00',
		ORANGE: 'e67e22',
		RED: 'e74c3c',
		GREY: '95a5a6',
		G_TRANSLATE: '4989f4',
		IMDB: 'f3ce13',
		INSTAGRAM: 'e1306c',
		MAL: '2e51a2',
		NPM: 'cc3534',
		OPENWEATHER: 'e96e4c',
		SPOTIFY: '1db954',
		STEAM: '2a475e',
		YOUTUBE: 'c4302b',
		WIKIPEDIA: '6b6b6b'
	},
	Emoji: {
		ONLINE: '<:online:712397262256472075>',
		IDLE: '<:idle:712397201955094708>',
		DND: '<:dnd:712397154836283392>',
		OFFLINE: '<:offline:712397086100029440>',
		BOT: '<:bot:729455298917564467>'
	},
	Environment: {
		IMDB: process.env.IMDB_KEY,
		OPEN_WEATHER_ID: process.env.OPEN_WEATHER_ID,
		SPOTIFY_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
		YOUTUBE: process.env.YOUTUBE_KEY
	},
	Supports: {
		GUILD_LOGS: process.env.GUILD_LOGS
	}
};
