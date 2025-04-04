'use client';

import * as React from 'react';
import * as Primitive from 'fumadocs-core/toc';
import { useEffectEvent } from 'fumadocs-core/utils/use-effect-event';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';

type TOCThumbType = [top: number, height: number];

function calc(container: HTMLElement, active: string[]): TOCThumbType {
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

function update(element: HTMLElement, info: TOCThumbType): void {
	element.style.setProperty('--thumb-top', `${info[0]}px`);
	element.style.setProperty('--thumb-height', `${info[1]}px`);
}

function TOCThumb({
	containerRef,
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	containerRef: React.RefObject<HTMLElement | null>;
}): React.ReactNode {
	const active = Primitive.useActiveAnchors();
	const thumbRef = React.useRef<HTMLDivElement>(null);

	const onResize = useEffectEvent(() => {
		if (!containerRef.current || !thumbRef.current) return;

		update(thumbRef.current, calc(containerRef.current, active));
	});

	React.useEffect(() => {
		if (!containerRef.current) return;
		const container = containerRef.current;

		onResize();
		const observer = new ResizeObserver(onResize);
		observer.observe(container);

		return () => {
			observer.disconnect();
		};
	}, [containerRef, onResize]);

	useOnChange(active, () => {
		if (!containerRef.current || !thumbRef.current) return;

		update(thumbRef.current, calc(containerRef.current, active));
	});

	return <div ref={thumbRef} role="none" {...props} />;
}

export { type TOCThumbType, TOCThumb };
