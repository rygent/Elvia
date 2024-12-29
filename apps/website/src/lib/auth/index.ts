import { authConfig } from '@/lib/auth/config';
import { env } from '@/env';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@elvia/database';
import jwt from 'jsonwebtoken';
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'jwt',
		maxAge: 7 * 24 * 60 * 60,
		updateAge: 12 * 60 * 60
	},
	pages: {
		signIn: '/'
	},
	secret: env.AUTH_SECRET,
	events: {
		async signIn({ user, profile, isNewUser }) {
			if (!isNewUser) {
				if (profile) {
					await prisma.user.update({
						where: { id: user.id },
						data: { name: profile.name, username: profile.username, email: profile.email!, image: profile.image! }
					});
				}
			}
		}
	},
	callbacks: {
		async jwt({ token }) {
			if (!token.sub) return token;

			const user = await prisma.user.findUnique({ where: { id: token.sub }, include: { accounts: true } });
			if (!user) return token;

			const userId = user.accounts.find((account) => account.userId === token.sub)?.providerAccountId;

			token.id = userId;
			token.name = user.name;
			token.username = user.username;
			token.email = user.email;
			token.image = user.image;

			return token;
		},
		// eslint-disable-next-line @typescript-eslint/require-await
		async session({ session, token }) {
			const secret = env.JWT_SECRET;
			if (secret) {
				const payload = {
					exp: Math.floor(new Date(session.expires).getTime() / 1000),
					sub: token.sub,
					id: token.id,
					name: token.name,
					username: token.username,
					email: token.email,
					role: 'authenticated'
				};

				session.access_token = jwt.sign(payload, secret);
			}

			if (token && session.user) {
				session.user.id = token.id!;
				session.user.name = token.name;
				session.user.username = token.username;
				session.user.email = token.email!;
				session.user.image = token.image;
			}

			return session;
		}
	},
	...authConfig
});
