import 'server-only';
import type { Monitor, UptimeMonitorResponse } from '@/types/betterstack';
import { env } from '@/env';

export async function getUptimeStatus(): Promise<Monitor[] | null> {
	if (!env.BETTERSTACK_API_KEY) return null;

	try {
		const response = await fetch('https://uptime.betterstack.com/api/v2/monitor-groups/1384070/monitors', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${env.BETTERSTACK_API_KEY}`
			}
		});

		if (!response.ok) return null;

		const { data } = (await response.json()) as UptimeMonitorResponse;

		return data;
	} catch (error) {
		return null;
	}
}
