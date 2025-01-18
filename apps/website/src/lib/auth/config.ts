import { env } from '@/env';
import type { NextAuthConfig } from 'next-auth';
import Discord, { type DiscordProfile } from 'next-auth/providers/discord';

export const authConfig = {
	providers: [
		Discord({
			clientId: env.DISCORD_APPLICATION_ID,
			clientSecret: env.DISCORD_APPLICATION_SECRET,
			authorization: {
				url: 'https://discord.com/api/oauth2/authorize',
				params: { scope: 'identify email guilds' }
			},
			allowDangerousEmailAccountLinking: true,
			// eslint-disable-next-line @typescript-eslint/require-await
			async profile(profile: DiscordProfile) {
				if (profile.avatar === null) {
					const defaultAvatarNumber = Number(BigInt(profile.id) >> BigInt(22)) % 6;
					profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
				} else {
					const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
					profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
				}

				return {
					id: profile.id,
					name: profile.global_name ?? profile.username,
					username: profile.username,
					email: profile.email,
					image: profile.image_url
				};
			}
		})
	]
} satisfies NextAuthConfig;
