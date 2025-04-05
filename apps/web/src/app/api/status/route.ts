import { NextResponse } from 'next/server';
import { fetcher } from '@/lib/fetcher';
import type { UptimeMonitorResponse } from '@/types/betterstack';
import { env } from '@/env';

export async function GET() {
	const response: UptimeMonitorResponse = await fetcher(
		'https://uptime.betterstack.com/api/v2/monitor-groups/1384070/monitors',
		{
			headers: {
				Authorization: `Bearer ${env.BETTERSTACK_API_KEY}`
			}
		}
	);

	const data = response.data.map((monitor) => ({
		name: monitor.attributes.pronounceable_name,
		status: monitor.attributes.status
	}));

	return NextResponse.json(data);
}
