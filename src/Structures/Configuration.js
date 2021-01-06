/* eslint-disable no-process-env */
module.exports = {
	token: process.env.BOT_TOKEN,
	prefix: process.env.BOT_PREFIX,
	owner: process.env.BOT_OWNER,
	defaultPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
	Access: {
		IMDB: process.env.IMDB_KEY,
		OPENWEATHER: process.env.OPEN_WEATHER_ID,
		Spotify: {
			CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
			CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET
		},
		YOUTUBE: process.env.YOUTUBE_KEY
	},
	Colors: {
		DEFAULT: 'ff4654',
		GREEN: '2ecc71',
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
	Emojis: {
		DEVELOPER: '<:developer:712397604192780328>',
		BOT: '<:bot:729455298917564467>',
		ONLINE: '<:online:712397262256472075>',
		IDLE: '<:idle:712397201955094708>',
		DND: '<:dnd:712397154836283392>',
		OFFLINE: '<:offline:712397086100029440>'
	}
};
