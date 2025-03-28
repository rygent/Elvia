'use client';

import * as React from 'react';
import Link from 'next/link';
import { fetcher } from '@/lib/fetcher';
import { type MonitorStatus } from '@/types/betterstack';
import { cn } from '@elvia/utils';
import useSWR from 'swr';

export function StatusBadge() {
	const { data, error } = useSWR<{ name: string; status: MonitorStatus }[]>('/api/status', fetcher);

	const [color, setColor] = React.useState<string>();
	const [textColor, setTextColor] = React.useState<string>();
	const [status, setStatus] = React.useState<string>();

	React.useEffect(() => {
		if (error) {
			setColor('bg-muted-foreground');
			setTextColor('text-muted-foreground');
			setStatus('Unable to fetch status');
		}

		if (!data) return;

		const incidents = data.filter((monitor) => monitor.status === 'up').length / data.length;
		if (incidents === 0) {
			setColor('bg-red-500');
			setTextColor('text-red-500');
			setStatus('Degraded performance');
		} else if (incidents < 1) {
			setColor('bg-yellow-500');
			setTextColor('text-yellow-500');
			setStatus('Partial outage');
		} else {
			setColor('bg-blue-600');
			setTextColor('text-blue-600');
			setStatus('All systems normal');
		}
	}, [data, error]);

	return (
		<Link href="https://elvia.betteruptime.com/" target="_blank" rel="noopener" className="-ml-2 h-fit w-fit pl-2">
			<div className="hover:bg-accent ease-ease -ml-2 inline-flex h-[34px] max-w-[300px] items-center gap-1.5 rounded-md p-2 transition-all duration-200">
				<span className={cn('relative inline-flex h-2 w-2 rounded-full', color)} />
				<p
					className={cn('overflow-x-hidden overflow-y-hidden text-start text-sm text-nowrap text-ellipsis', textColor)}
				>
					{status}
				</p>
			</div>
		</Link>
	);
}
