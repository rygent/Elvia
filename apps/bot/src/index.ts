import { ActivityType, AllowedMentionsTypes, GatewayIntentBits } from 'discord-api-types/v10';
import { Options, Partials } from 'discord.js';
import { Client } from '@elvia/tesseract';
import { env } from '@/env.js';
import 'dotenv/config';

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
	partials: [Partials.Message, Partials.Channel],
	allowedMentions: {
		parse: [AllowedMentionsTypes.User, AllowedMentionsTypes.Role],
		repliedUser: false
	},
	presence: {
		activities: [...(env.CustomStatus ? [{ name: env.CustomStatus, type: ActivityType.Custom }] : [])]
	},
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3e2,
			lifetime: 432e2
		}
	}
});

void client.start();
