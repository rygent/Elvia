'use client';

import * as React from 'react';
import { TocThumb } from '@/components/ui/toc-thumb';
import { mergeRefs } from '@/lib/merge-refs';
import { cn } from '@elvia/utils';
import * as Primitive from 'fumadocs-core/toc';
import { Text } from 'lucide-react';

const TocContext = React.createContext<Primitive.TOCItemType[]>([]);

function useTocItems(): Primitive.TOCItemType[] {
	return React.useContext(TocContext);
}

function TocProvider({ children, toc, ...props }: React.ComponentProps<typeof Primitive.AnchorProvider>) {
	return (
		<TocContext value={toc}>
			<Primitive.AnchorProvider toc={toc} {...props}>
				{children}
			</Primitive.AnchorProvider>
		</TocContext>
	);
}

function TocTitle({ className, ...props }: React.ComponentProps<'h3'>) {
	return (
		<h3 className={cn('inline-flex items-center gap-1.5 text-muted-foreground', className)} {...props}>
			<Text className="size-4" />
			<span className="text-sm">On this page</span>
		</h3>
	);
}

function TocScrollArea({ ref, className, children, ...props }: React.ComponentProps<'div'>) {
	const viewRef = React.useRef<HTMLDivElement>(null);

	return (
		<div
			ref={mergeRefs(viewRef, ref)}
			className={cn(
				'relative ms-px min-h-0 overflow-auto [mask-image:linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3 text-sm [scrollbar-width:none]',
				className
			)}
			{...props}
		>
			<Primitive.ScrollProvider containerRef={viewRef}>{children}</Primitive.ScrollProvider>
		</div>
	);
}

function TocItems({ ref, className, ...props }: React.ComponentProps<'div'>) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const items = useTocItems();

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
				const element: HTMLElement | null = container.querySelector(`a[href="#${items[i]?.url.slice(1)}"]`);
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

	if (items.length === 0)
		return <div className="rounded-lg border bg-card p-3 text-xs text-muted-foreground">No Headings</div>;

	return (
		<TocScrollArea>
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
					<TocThumb
						containerRef={containerRef}
						className="mt-(--thumb-top) h-(--thumb-height) bg-primary transition-all"
					/>
				</div>
			) : null}
			<div ref={mergeRefs(containerRef, ref)} className={cn('flex flex-col', className)} {...props}>
				{items.map((item, i) => (
					<TocItem key={item.url} item={item} upper={items[i - 1]?.depth} lower={items[i + 1]?.depth} />
				))}
			</div>
		</TocScrollArea>
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

function TocItem({
	item,
	upper = item.depth,
	lower = item.depth
}: {
	item: Primitive.TOCItemType;
	upper?: number;
	lower?: number;
}) {
	const offset = getLineOffset(item.depth);
	const upperOffset = getLineOffset(upper);
	const lowerOffset = getLineOffset(lower);

	return (
		<Primitive.TOCItem
			href={item.url}
			style={{
				paddingInlineStart: getItemOffset(item.depth)
			}}
			className="relative prose py-1.5 text-sm [overflow-wrap:anywhere] text-muted-foreground transition-colors first:pt-0 last:pb-0 hover:text-accent-foreground data-[active=true]:text-primary"
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
					'absolute inset-y-0 w-px bg-foreground/10',
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

export { TocProvider, TocTitle, TocItems, useTocItems };
