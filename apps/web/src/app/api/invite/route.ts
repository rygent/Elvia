import { NextResponse } from 'next/server';
import { externalLink } from '@/config';
import { env } from '@/env';

export function GET() {
	return NextResponse.redirect(externalLink.invite.replace('{{client_id}}', env.DISCORD_APPLICATION_ID));
}
