import { NextResponse } from 'next/server';
import { externalLink } from '@/config';

export function GET() {
	return NextResponse.redirect(externalLink.discord);
}
