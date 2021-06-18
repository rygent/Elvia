/* eslint-disable no-process-env */
module.exports = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.DISCORD_PREFIX,
	owner: process.env.DISCORD_OWNER,
	defaultPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
	Access: {
		IMDB: process.env.IMDB_KEY,
		OPENWEATHER: process.env.OPEN_WEATHER_ID,
		Spotify: {
			CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
			CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET
		},
		YOUTUBE: process.env.YOUTUBE_KEY,
		MONGO_URI: process.env.MONGO_URI
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
	Emojis: require('../../assets/json/Emoji.json'),
	Supports: {
		GUILD_LOGS: process.env.GUILD_LOGS
	}
};
