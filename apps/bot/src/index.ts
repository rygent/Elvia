import { CoreClient } from '@elvia/core';
import { GatewayIntentBits } from 'discord-api-types/v10';
import { Partials, Options } from 'discord.js';
import { ExtendedSettings } from '@/lib/settings.js';
import dotenv from 'dotenv';

// eslint-disable-next-line import-x/no-named-as-default-member
dotenv.config({ override: true, quiet: true });

const client = new CoreClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
	partials: [Partials.Message, Partials.Channel],
	allowedMentions: {
		repliedUser: false
	},
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3e2,
			lifetime: 432e2
		}
	},
	settings: new ExtendedSettings()
});

void client.start();
