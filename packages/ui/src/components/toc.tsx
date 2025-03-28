'use client';

import * as React from 'react';
import * as Primitive from 'fumadocs-core/toc';
import { type TOCItemType } from 'fumadocs-core/server';
import { useEffectEvent } from 'fumadocs-core/utils/use-effect-event';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@elvia/ui/components/collapsible';
import { ScrollArea } from '@elvia/ui/components/scroll-area';
import { TOCThumb } from '@elvia/ui/components/toc-thumb';
import { cn } from '@elvia/utils';
import { ChevronRight, Text } from 'lucide-react';

function TOCProvider({ ...props }: React.ComponentProps<typeof Primitive.AnchorProvider>) {
	return <Primitive.AnchorProvider {...props} />;
}

function TOCItemsEmpty() {
	return <div className="bg-card text-muted-foreground rounded-lg border p-3 text-xs">No Headings</div>;
}

function TOCScrollArea({
	children,
	className,
	isMenu = false,
	...props
}: React.ComponentProps<typeof ScrollArea> & { isMenu?: boolean }) {
	const viewportRef = React.useRef<HTMLDivElement>(null);

	return (
		<ScrollArea
			className={cn('relative flex min-h-0 flex-col text-sm', { 'mx-4 mt-2 mb-4 md:mx-6': isMenu }, className)}
			ref={viewportRef}
			{...props}
		>
			<Primitive.ScrollProvider containerRef={viewportRef}>{children}</Primitive.ScrollProvider>
		</ScrollArea>
	);
}

function TOCItems({
	className,
	items,
	isMenu = false
}: React.ComponentProps<typeof TOCScrollArea> & { items: TOCItemType[] }) {
	const containerRef = React.useRef<HTMLDivElement>(null);

	const [svg, setSvg] = React.useState<{
		path: string;
		width: number;
		height: number;
	}>();

	React.useEffect(() => {
		if (!containerRef.current) return;
		const container = containerRef.current;

		function onResize(): void {
			if (container.clientHeight === 0) return;
			let w = 0;
			let h = 0;
			const d: string[] = [];
			for (let i = 0; i < items.length; i++) {
				const element: HTMLElement | null = container.querySelector(`a[href="#${items[i]!.url.slice(1)}"]`);
				if (!element) continue;

				const styles = getComputedStyle(element);
				const offset = getLineOffset(items[i]!.depth) + 1;
				const top = element.offsetTop + parseFloat(styles.paddingTop);
				const bottom = element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom);

				w = Math.max(offset, w);
				h = Math.max(h, bottom);

				d.push(`${i === 0 ? 'M' : 'L'}${offset} ${top}`);
				d.push(`L${offset} ${bottom}`);
			}

			setSvg({
				path: d.join(' '),
				width: w + 1,
				height: h
			});
		}

		const observer = new ResizeObserver(onResize);
		onResize();

		observer.observe(container);
		return () => {
			observer.disconnect();
		};
	}, [items]);

	if (items.length === 0) return <TOCItemsEmpty />;

	return (
		<TOCScrollArea className={cn(className)} isMenu={isMenu}>
			{svg ? (
				<div
					className="absolute start-0 top-0 rtl:-scale-x-100"
					style={{
						width: svg.width,
						height: svg.height,
						maskImage: `url("data:image/svg+xml,${
							// Inline SVG
							encodeURIComponent(
								`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`
							)
						}")`
					}}
				>
					<TOCThumb
						containerRef={containerRef}
						className="bg-foreground mt-(--thumb-top) h-(--thumb-height) transition-all"
					/>
				</div>
			) : null}
			<div className="flex flex-col" ref={containerRef}>
				{items.map((item, i) => (
					<TOCItem key={item.url} item={item} upper={items[i - 1]?.depth} lower={items[i + 1]?.depth} />
				))}
			</div>
		</TOCScrollArea>
	);
}

function getItemOffset(depth: number): number {
	if (depth <= 2) return 14;
	if (depth === 3) return 26;
	return 36;
}

function getLineOffset(depth: number): number {
	return depth >= 3 ? 10 : 0;
}

function TOCItem({
	item,
	upper = item.depth,
	lower = item.depth
}: {
	item: TOCItemType;
	upper?: number;
	lower?: number;
}): React.ReactElement {
	const offset = getLineOffset(item.depth);
	const upperOffset = getLineOffset(upper);
	const lowerOffset = getLineOffset(lower);

	return (
		<Primitive.TOCItem
			href={item.url}
			style={{
				paddingInlineStart: getItemOffset(item.depth)
			}}
			className={cn(
				'prose text-muted-foreground data-[active=true]:text-foreground relative py-1.5 text-sm [overflow-wrap:anywhere] transition-colors first:pt-0 last:pb-0'
			)}
		>
			{offset !== upperOffset ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					className="absolute start-0 -top-1.5 size-4 rtl:-scale-x-100"
				>
					<line x1={upperOffset} y1="0" x2={offset} y2="12" className="stroke-foreground/10" strokeWidth="1" />
				</svg>
			) : null}
			<div
				className={cn(
					'bg-foreground/10 absolute inset-y-0 w-px',
					offset !== upperOffset && 'top-1.5',
					offset !== lowerOffset && 'bottom-1.5'
				)}
				style={{
					insetInlineStart: offset
				}}
			/>
			{item.title}
		</Primitive.TOCItem>
	);
}

function TOC({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn('sticky top-14 h-[calc(100vh-3.5rem)] pt-4 pb-2', className)}>
			<div className="flex h-full max-w-full flex-col gap-3 pe-4">
				<h3 className="text-muted-foreground -ms-0.5 inline-flex items-center gap-1.5 text-sm">
					<Text className="size-4" />
					On this page
				</h3>
				{children}
			</div>
		</div>
	);
}

const Context = React.createContext<{
	open: boolean;
	setOpen: (open: boolean) => void;
} | null>(null);

function TOCInline({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
	const ref = React.useRef<HTMLElement>(null);
	const [open, setOpen] = React.useState(false);

	const onClick = useEffectEvent((e: Event) => {
		if (!open) return;

		if (ref.current && !ref.current.contains(e.target as HTMLElement)) setOpen(false);
	});

	React.useEffect(() => {
		window.addEventListener('click', onClick);

		return () => {
			window.removeEventListener('click', onClick);
		};
	}, [onClick]);

	return (
		<div className={cn('sticky top-14 z-10 overflow-visible', className)}>
			<Collapsible open={open} onOpenChange={setOpen} asChild>
				<Context.Provider
					value={React.useMemo(
						() => ({
							open,
							setOpen
						}),
						[setOpen, open]
					)}
				>
					<nav
						className={cn(
							'bg-background/90 supports-[backdrop-filter]:bg-background/90 backdrop-blur transition-colors'
						)}
						ref={ref}
					>
						{children}
					</nav>
				</Context.Provider>
			</Collapsible>
		</div>
	);
}

function TOCInlineTrigger({
	items,
	className,
	...props
}: React.ComponentProps<typeof CollapsibleTrigger> & { items: TOCItemType[] }) {
	const { open } = React.use(Context)!;
	const active = Primitive.useActiveAnchor();
	const current = React.useMemo(() => {
		return items.find((item) => active === item.url.slice(1))?.title;
	}, [items, active]);

	return (
		<CollapsibleTrigger
			className={cn(
				'inline-flex items-center gap-2 px-4 py-2.5 text-start text-sm text-nowrap focus-visible:outline-none md:px-6',
				className
			)}
			{...props}
		>
			<Text className="size-4 shrink-0" />
			On this page
			<ChevronRight
				className={cn(
					'text-muted-foreground size-4 shrink-0 transition-all',
					!current && 'opacity-0',
					open ? 'rotate-90' : '-ms-1.5'
				)}
			/>
			<span
				className={cn('text-muted-foreground -ms-1.5 truncate transition-opacity', (!current || open) && 'opacity-0')}
			>
				{current}
			</span>
		</CollapsibleTrigger>
	);
}

function TOCInlineItems({
	items,
	className,
	...props
}: React.ComponentProps<typeof CollapsibleContent> & { items: TOCItemType[] }) {
	return (
		<CollapsibleContent data-toc-popover="" className={cn('flex max-h-[50vh] flex-col', className)} {...props}>
			<TOCItems items={items} isMenu />
		</CollapsibleContent>
	);
}

export { TOCProvider, TOC, TOCItems, TOCInline, TOCInlineTrigger, TOCInlineItems };
