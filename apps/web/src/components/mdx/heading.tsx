import { cn } from '@elvia/utils';

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

	return (
		<As className={cn('text-foreground scroll-m-28', className)} {...props}>
			{children}
		</As>
	);
}
