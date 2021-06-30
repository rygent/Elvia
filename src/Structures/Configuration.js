/* eslint-disable no-process-env */
module.exports = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.DISCORD_PREFIX,
	owner: process.env.DISCORD_OWNER,
	defaultPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
	Access: {
		IMDB: process.env.IMDB_KEY,
		MONGO_URI: process.env.MONGO_URI,
		OPENWEATHER: process.env.OPEN_WEATHER_ID,
		WEBHOOK_ID: process.env.WEBHOOK_ID,
		WEBHOOK_TOKEN: process.env.WEBHOOK_TOKEN,
		YOUTUBE: process.env.YOUTUBE_KEY
	},
	Colors: {
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
	Emojis: require('../../assets/json/Emoji.json')
};
