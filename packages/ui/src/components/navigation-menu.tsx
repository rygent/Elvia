import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';

import { cn } from '@elvia/utils';

function NavigationMenu({ className, children, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
	return (
		<NavigationMenuPrimitive.Root data-slot="navigation-menu" {...props}>
			{children}
		</NavigationMenuPrimitive.Root>
	);
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
	return <NavigationMenuPrimitive.List data-slot="navigation-menu-list" className={cn(className)} {...props} />;
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
	return (
		<NavigationMenuPrimitive.Item data-slot="navigation-menu-item" className={cn('list-none', className)} {...props} />
	);
}

const navigationMenuTriggerStyle = cva(
	'inline-flex items-center justify-center rounded-md p-2 text-sm text-muted-foreground transition-colors hover:text-accent-foreground data-[active=true]:text-primary data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground'
);

function NavigationMenuTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
	return (
		<NavigationMenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cn(navigationMenuTriggerStyle(), className)}
			{...props}
		>
			{children}
		</NavigationMenuPrimitive.Trigger>
	);
}

function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-menu-content"
			className={cn(
				'absolute inset-x-0 top-0 max-h-[80svh] overflow-auto data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-enter-to-right data-[motion=to-start]:animate-enter-to-left',
				className
			)}
			{...props}
		/>
	);
}

function NavigationMenuViewport({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
	return (
		<div className={cn('flex w-full justify-center')}>
			<NavigationMenuPrimitive.Viewport
				data-slot="navigation-menu-viewport"
				className={cn(
					'relative h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden transition-[width,height] duration-300 data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in',
					className
				)}
				{...props}
			/>
		</div>
	);
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
	return (
		<NavigationMenuPrimitive.Link
			data-slot="navigation-menu-link"
			className={cn(
				'flex flex-col transition-[color,box-shadow] hover:bg-accent/80 hover:text-accent-foreground',
				className
			)}
			{...props}
		/>
	);
}

function NavigationMenuIndicator({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
	return (
		<NavigationMenuPrimitive.Indicator
			data-slot="navigation-menu-indicator"
			className={cn(
				'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in',
				className
			)}
			{...props}
		>
			<div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
		</NavigationMenuPrimitive.Indicator>
	);
}

export {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuIndicator,
	NavigationMenuViewport,
	navigationMenuTriggerStyle
};
