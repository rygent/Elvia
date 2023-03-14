export const enum Colors {
	Default = 0x2f3136,
	Green = 0x77dd77,
	Yellow = 0xfdfd96,
	Orange = 0xffb347,
	Red = 0xff6961,
	Grey = 0xcfcfc4
}

export const Credentials = {
	ImgurClientId: process.env.IMGUR_CLIENT_ID as string,
	OpenWeatherApiKey: process.env.OPEN_WEATHER_API_KEY as string,
	SpotifyClientId: process.env.SPOTIFY_CLIENT_ID as string,
	SpotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
	TmdbApiKey: process.env.TMDB_API_KEY as string
} as const;

export const enum Emojis {
	Bot = '<:bot:1038606332900675624>',
	Alarm = '<:alarm:950481082191581224>',
	Info = '<:info:950481046821036082>',
	Spotify = '<:spotify:950481019012804659>',
	First = '<:first:1032617403965771786>',
	Previous = '<:previous:1032617521586651186>',
	Next = '<:next:1032617635122257961>',
	Last = '<:last:1032617724922314782>',
	Branch = '<:branch:1048976559345770556>'
}

export const Links = {
	SupportServer: process.env.SUPPORT_SERVER_URL as string,
	LoggerWebhook: process.env.LOGGER_WEBHOOK_URL as string,
	GuildWebhook: process.env.GUILD_WEBHOOK_URL as string
} as const;
