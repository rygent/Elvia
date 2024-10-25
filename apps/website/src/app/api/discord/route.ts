import { NextResponse } from 'next/server';
import { siteConfig } from '@/config';

export function GET() {
	return NextResponse.redirect(siteConfig.external.links.discord);
}
