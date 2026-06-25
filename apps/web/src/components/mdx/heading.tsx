import { cn } from '@elvia/utils';
import { Link04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type HeadingTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingProps<T extends HeadingTypes> = Omit<React.ComponentPropsWithoutRef<T>, 'as'> & {
	as?: T;
};

export function Heading<T extends HeadingTypes>({
	className,
	children,
	as,
	...props
}: HeadingProps<T>): React.ReactElement {
	const As = as ?? 'h1';

	if (!props.id) return <As className={className} {...props} />;

	return (
		<As className={cn('flex scroll-m-28 flex-row items-center gap-1', className)} {...props}>
			<a data-card="" href={`#${props.id}`} className="peer">
				{children}
			</a>
			<HugeiconsIcon
				icon={Link04Icon}
				size={14}
				strokeWidth={2}
				aria-label="Link to section"
				className="shrink-0 text-muted-foreground opacity-0 transition-opacity peer-hover:opacity-100"
			/>
		</As>
	);
}
