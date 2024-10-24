import { NextResponse } from 'next/server';
import { siteConfig } from '@/config';

export function GET() {
	return NextResponse.redirect(
		siteConfig.external.links.invite.replace('{{client_id}}', process.env.DISCORD_APPLICATION_ID!)
	);
}
