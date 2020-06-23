/* eslint-disable no-process-env */
module.exports = {
	token: process.env.TOKEN,
	prefix: process.env.PREFIX,
	Owners: process.env.OWNER,
	Access: {
		IMDB: process.env.IMDB_API_KEY,
		YOUTUBE: process.env.YOUTUBE_API_KEY
	},
	Colors: {
		DEFAULT: 'ff4654',
		AQUA: '1abc9c',
		GREEN: '2ecc71',
		BLUE: '3498db',
		PURPLE: '9b59b6',
		GOLD: 'f1c40f',
		ORANGE: 'e67e22',
		RED: 'e74c3c',
		GREY: '95a5a6',
		DARKER_GREY: '7f8c8d',
		NAVY: '34495e',
		DARK_AQUA: '11806a',
		DARK_GREEN: '1f8b4c',
		DARK_BLUE: '206694',
		DARK_PURPLE: '71368a',
		DARK_GOLD: 'c27c0e',
		DARK_ORANGE: 'a84300',
		DARK_RED: '992d22',
		DARK_GREY: '979c9f',
		LIGHT_GREY: 'bcc0c0',
		DARK_NAVY: '2c3e50',
		LUMINOUS_VIVID_PINK: 'fd0061',
		DARK_VIVID_PINK: 'bc0057',
		IMDB: 'f3ce13',
		INSTAGRAM: 'e1306c',
		MAL: '2e51a2',
		NPM: 'cc3534',
		STEAM: '2a475e',
		YOUTUBE: 'c4302b',
		WIKIPEDIA: '6b6b6b'
	},
	Emojis: {
		SUCCESS: '<:success:721207406431830056>',
		ERROR: '<:error:721207638016393236>',
		ONLINE: '<:online:712397262256472075>',
		IDLE: '<:idle:712397201955094708>',
		DND: '<:dnd:712397154836283392>',
		OFFLINE: '<:offline:712397086100029440>',
		DEVELOPER: '<:developer:712397604192780328>'
	}
};
