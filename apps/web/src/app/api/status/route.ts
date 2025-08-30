import { NextResponse } from 'next/server';
import { fetcher } from '@/lib/fetcher';
import { type UptimeMonitorResponse } from '@/types/betterstack';
import { api } from '@/config';
import { env } from '@/env';

export async function GET() {
	const response: UptimeMonitorResponse = await fetcher(api.betterstack, {
		headers: {
			Authorization: `Bearer ${env.BETTERSTACK_API_KEY}`
		}
	});

	const data = response.data.map((monitor) => ({
		name: monitor.attributes.pronounceable_name,
		status: monitor.attributes.status
	}));

	return NextResponse.json(data);
}
