'use client';

import * as React from 'react';
import * as Primitive from 'fumadocs-core/toc';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';

type TocThumb = [top: number, height: number];

function calc(container: HTMLElement, active: string[]): TocThumb {
	if (active.length === 0 || container.clientHeight === 0) {
		return [0, 0];
	}

	let upper = Number.MAX_VALUE;
	let lower = 0;

	for (const item of active) {
		const element = container.querySelector<HTMLElement>(`a[href="#${item}"]`);
		if (!element) continue;

		const styles = getComputedStyle(element);
		upper = Math.min(upper, element.offsetTop + parseFloat(styles.paddingTop));
		lower = Math.max(lower, element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom));
	}

	return [upper, lower - upper];
}

function TocThumb({
	containerRef,
	...props
}: React.ComponentProps<'div'> & {
	containerRef: React.RefObject<HTMLElement | null>;
}) {
	const active = Primitive.useActiveAnchors();
	const thumbRef = React.useRef<HTMLDivElement>(null);

	function update(info: TocThumb): void {
		const element = thumbRef.current;
		if (!element) return;

		element.style.setProperty('--thumb-top', `${info[0]}px`);
		element.style.setProperty('--thumb-height', `${info[1]}px`);
	}

	const onPrint = React.useEffectEvent(() => {
		if (containerRef.current) {
			update(calc(containerRef.current, active));
		}
	});

	React.useEffect(() => {
		if (!containerRef.current) return;
		const container = containerRef.current;

		const observer = new ResizeObserver(onPrint);
		observer.observe(container);

		return () => {
			observer.disconnect();
		};
	}, [containerRef]);

	useOnChange(active, () => {
		if (containerRef.current) {
			update(calc(containerRef.current, active));
		}
	});

	return <div ref={thumbRef} data-hidden={active.length === 0} {...props} />;
}

export { TocThumb };
