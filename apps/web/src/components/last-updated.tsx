import * as React from 'react';
import { cn } from '@elvia/utils';

export function LastUpdated({
	className,
	date: value,
	...props
}: Omit<React.ComponentProps<'p'>, 'children'> & { date: Date | string }) {
	const date = new Date(value).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return (
		<p className={cn('text-sm text-muted-foreground', className)} {...props}>
			Last updated: {date}
		</p>
	);
}
