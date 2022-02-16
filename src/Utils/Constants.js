exports.Access = {
	InviteLink: process.env.INVITE_LINK,
	GuildLogWebhook: process.env.GUILD_LOG_WEBHOOK_URL
};

exports.Colors = {
	Default: 0x2f3136,
	Green: 0x77dd77,
	Yellow: 0xfdfd96,
	Orange: 0xffb347,
	Red: 0xff6961,
	Grey: 0xcfcfc4
};

exports.Emojis = {
	Online: '<:online:712397262256472075>',
	Idle: '<:idle:712397201955094708>',
	Dnd: '<:dnd:712397154836283392>',
	Offline: '<:offline:712397086100029440>',
	Spotify: '<:spotify:859713717595144233>'
};

exports.Secrets = {
	ImdbApiKey: process.env.IMDB_API_KEY,
	OpenWeatherApiKey: process.env.OPEN_WEATHER_API_KEY,
	SpotifyId: process.env.SPOTIFY_ID,
	SpotifySecret: process.env.SPOTIFY_SECRET,
	YoutubeApiKey: process.env.YOUTUBE_API_KEY
};
