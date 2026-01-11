'use client';

import * as React from 'react';
import { useTreePath } from '@/components/context/tree';
import { useTocItems } from '@/components/ui/toc';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@elvia/ui';
import { cn } from '@elvia/utils';
import { useActiveAnchor } from 'fumadocs-core/toc';
import { useEffectEvent } from 'fumadocs-core/utils/use-effect-event';
import { ChevronDown } from 'lucide-react';

interface ProgressCircleProps extends Omit<React.ComponentProps<'svg'>, 'strokeWidth'> {
	value: number;
	strokeWidth?: number;
	size?: number;
	min?: number;
	max?: number;
}

function clamp(input: number, min: number, max: number): number {
	if (input < min) return min;
	if (input > max) return max;
	return input;
}

function ProgressCircle({
	value,
	strokeWidth = 2,
	size = 24,
	min = 0,
	max = 100,
	...restSvgProps
}: ProgressCircleProps) {
	const normalizedValue = clamp(value, min, max);
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const progress = (normalizedValue / max) * circumference;
	const circleProps = {
		cx: size / 2,
		cy: size / 2,
		r: radius,
		fill: 'none',
		strokeWidth
	};

	return (
		<svg
			role="progressbar"
			viewBox={`0 0 ${size} ${size}`}
			aria-valuenow={normalizedValue}
			aria-valuemin={min}
			aria-valuemax={max}
			{...restSvgProps}
		>
			<circle {...circleProps} className="stroke-current/25" />
			<circle
				{...circleProps}
				stroke="currentColor"
				strokeDasharray={circumference}
				strokeDashoffset={circumference - progress}
				strokeLinecap="round"
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
				className="transition-all"
			/>
		</svg>
	);
}

const TocPopoverContext = React.createContext<{
	open: boolean;
	setOpen: (open: boolean) => void;
} | null>(null);

function TocPopover({ className, children, ...props }: React.ComponentProps<'div'>) {
	const ref = React.useRef<HTMLElement>(null);
	const [open, setOpen] = React.useState<boolean>(false);

	const onClick = useEffectEvent((e: Event) => {
		if (!open) return;

		if (ref.current && !ref.current.contains(e.target as HTMLElement)) setOpen(false);
	});

	React.useEffect(() => {
		window.addEventListener('click', onClick);

		return () => {
			window.removeEventListener('click', onClick);
		};
	}, []);

	return (
		<TocPopoverContext
			value={React.useMemo(
				() => ({
					open,
					setOpen
				}),
				[setOpen, open]
			)}
		>
			<Collapsible open={open} onOpenChange={setOpen} asChild>
				<header
					ref={ref}
					className={cn(
						'fixed inset-x-0 top-14 z-10 border-b bg-background/80 backdrop-blur-lg transition-colors xl:hidden',
						open && 'rounded-b-2xl shadow-lg',
						className
					)}
					{...props}
				>
					{children}
				</header>
			</Collapsible>
		</TocPopoverContext>
	);
}

function TocPopoverContent({ className, ...props }: React.ComponentProps<'div'>) {
	return <CollapsibleContent className={cn('flex max-h-[50vh] flex-col px-4 md:px-6', className)} {...props} />;
}

function TocPopoverTrigger({ className, ...props }: React.ComponentProps<'button'>) {
	const { open } = React.use(TocPopoverContext)!;
	const items = useTocItems();
	const active = useActiveAnchor();
	const selected = React.useMemo(() => items.findIndex((item) => active === item.url.slice(1)), [items, active]);
	const path = useTreePath().at(-1);
	const showItem = selected !== -1 && !open;

	return (
		<CollapsibleTrigger
			className={cn(
				'flex h-10 w-full items-center gap-2.5 px-4 py-2.5 text-start text-sm text-muted-foreground focus-visible:outline-none md:px-6 [&_svg]:size-4',
				className
			)}
			{...props}
		>
			<ProgressCircle
				value={(selected + 1) / Math.max(1, items.length)}
				max={1}
				className={cn('shrink-0', open && 'text-primary')}
			/>
			<span className="grid flex-1 *:col-start-1 *:row-start-1 *:my-auto">
				<span
					className={cn(
						'truncate transition-all',
						open && 'text-foreground',
						showItem && 'pointer-events-none -translate-y-full opacity-0'
					)}
				>
					{path?.name ?? 'On this page'}
				</span>
				<span className={cn('truncate transition-all', !showItem && 'pointer-events-none translate-y-full opacity-0')}>
					{items[selected]?.title}
				</span>
			</span>
			<ChevronDown className={cn('mx-0.5 shrink-0 transition-transform', open && 'rotate-180')} />
		</CollapsibleTrigger>
	);
}

export { TocPopover, TocPopoverContent, TocPopoverTrigger };
