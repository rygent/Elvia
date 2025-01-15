import Link from 'next/link';
import type { Monitor } from '@/types/betterstack';
import { cn } from '@elvia/utils';

interface StatusIndicatorProps {
	data: Monitor[];
}

export function StatusIndicator({ data }: StatusIndicatorProps) {
	let statusColor;
	let statusTextColor;
	let statusLabel;

	try {
		const status = data.filter((monitor) => monitor.attributes.status === 'up').length / data.length;

		if (status === 0) {
			statusColor = 'bg-red-500';
			statusTextColor = 'text-red-500';
			statusLabel = 'Degraded performance';
		} else if (status < 1) {
			statusColor = 'bg-yellow-500';
			statusTextColor = 'text-yellow-500';
			statusLabel = 'Partial outage';
		} else {
			statusColor = 'bg-green-500';
			statusTextColor = 'text-green-500';
			statusLabel = 'All systems normal';
		}
	} catch {
		statusColor = 'bg-muted-foreground';
		statusTextColor = 'text-muted-foreground';
		statusLabel = 'Unable to fetch status';
	}

	return (
		<Link href="https://elvia.betteruptime.com/" target="_blank" rel="noopener" className="-ml-2 h-fit w-fit pl-2">
			<div className="-ml-2 inline-flex h-[34px] max-w-[300px] items-center gap-1.5 rounded-md p-2 transition-all duration-200 ease-ease hover:bg-accent">
				<span className="relative flex h-2 w-2">
					<span
						className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', statusColor)}
					/>
					<span className={cn('relative inline-flex h-2 w-2 rounded-full', statusColor)} />
				</span>
				<p
					className={cn(
						'overflow-x-hidden overflow-y-hidden text-ellipsis text-nowrap text-start text-sm',
						statusTextColor
					)}
				>
					{statusLabel}
				</p>
			</div>
		</Link>
	);
}
