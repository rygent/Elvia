import { GatewayIntentBits } from 'discord-api-types/v10';
import { CoreClient } from '@elvia/core';
import { Partials, Options } from 'discord.js';
import { Settings } from '@/lib/settings.js';
import { fileURLToPath } from 'node:url';

const settings = new Settings();

const client = new CoreClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
	partials: [Partials.Message, Partials.Channel],
	allowedMentions: {
		repliedUser: false
	},
	presence: settings.presence,
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3e2,
			lifetime: 432e2
		}
	},
	settings,
	root: fileURLToPath(import.meta.url)
});

void client.start();
