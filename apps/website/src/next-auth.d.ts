import type { AdapterSession, AdapterUser } from 'next-auth/adapters';
import type { DefaultJWT } from 'next-auth/jwt';
import type { DiscordProfile } from 'next-auth/providers/discord';

declare module 'next-auth' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Profile extends DiscordProfile {}

	interface User extends AdapterUser {
		username?: string | null;
	}

	interface Session extends AdapterSession {
		access_token?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		id?: string | null;
		username?: string | null;
		image?: string | null;
	}
}
