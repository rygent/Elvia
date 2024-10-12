import { ActivityType, AllowedMentionsTypes, GatewayIntentBits } from 'discord-api-types/v10';
import { Options, Partials } from 'discord.js';
import { Client } from '@elvia/tesseract';
import { Env } from '@/lib/Env.js';
import 'dotenv/config';

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
	partials: [Partials.Message, Partials.Channel],
	allowedMentions: {
		parse: [AllowedMentionsTypes.User, AllowedMentionsTypes.Role],
		repliedUser: false
	},
	presence: {
		activities: [...(Env.CustomStatus ? [{ name: Env.CustomStatus, type: ActivityType.Custom }] : [])]
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
