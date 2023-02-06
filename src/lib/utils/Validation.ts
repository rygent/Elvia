import Logger from '../modules/Logger.js';
import { italic, underline } from 'colorette';
const logger = new Logger();

function validation() {
	if (!process.env.IMGUR_CLIENT_ID) {
		logger.warn(`${underline('IMGUR_CLIENT_ID')} is required to use ${italic('imgur')} command.`);
	}

	if (!process.env.OPEN_WEATHER_API_KEY) {
		logger.warn(`${underline('OPEN_WEATHER_API_KEY')} is required to use ${italic('search weather')} command.`);
	}

	if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
		if (!process.env.SPOTIFY_CLIENT_ID) {
			logger.warn(`${underline('SPOTIFY_CLIENT_ID')} is required to use ${italic('search spotify')} command.`);
		}

		if (!process.env.SPOTIFY_CLIENT_SECRET) {
			logger.warn(`${underline('SPOTIFY_CLIENT_SECRET')} is required to use ${italic('search spotify')} command.`);
		}
	}

	if (!process.env.TMDB_API_KEY) {
		logger.warn(
			`${underline('TMDB_API_KEY')} is required to use ${italic('search movie')} & ${italic('search show')} command.`
		);
	}
}

validation();
