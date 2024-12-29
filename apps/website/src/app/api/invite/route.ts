import { NextResponse } from 'next/server';
import { siteConfig } from '@/config';
import { env } from '@/env';

export function GET() {
	return NextResponse.redirect(siteConfig.external.links.invite.replace('{{client_id}}', env.DISCORD_APPLICATION_ID));
}
