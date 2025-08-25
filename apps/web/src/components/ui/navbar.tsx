'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport
} from '@elvia/ui';
import { cn } from '@elvia/utils';

function NavbarMenu({ className, children, ...props }: React.ComponentProps<'div'>) {
	const [value, setValue] = React.useState<string>('');

	return (
		<NavigationMenu value={value} onValueChange={setValue} asChild>
			<header
				className={cn(
					'fixed top-0 z-40 w-full border-b bg-background/80 px-6 backdrop-blur-lg transition-colors *:mx-auto *:max-w-7xl max-md:px-0',
					value.length > 0 && 'max-lg:rounded-b-2xl max-lg:shadow-lg',
					className
				)}
				{...props}
			>
				<NavigationMenuList asChild>
					<nav className="flex h-14 w-full items-center max-md:px-4">{children}</nav>
				</NavigationMenuList>
				<NavigationMenuViewport />
			</header>
		</NavigationMenu>
	);
}

function NavbarMenuContent({ className, ...props }: React.ComponentProps<typeof NavigationMenuContent>) {
	return <NavigationMenuContent className={cn('grid grid-cols-1 gap-2 py-4 md:grid-cols-3', className)} {...props} />;
}

function NavbarMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuItem>) {
	return <NavigationMenuItem className={cn(className)} {...props} />;
}

function NavbarMenuLink({ className, children, ...props }: React.ComponentProps<typeof NavigationMenuLink>) {
	return (
		<NavigationMenuLink className={cn('flex flex-col transition-colors', className)} asChild {...props}>
			<Link href={props.href!}>{children}</Link>
		</NavigationMenuLink>
	);
}

function NavbarMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuList>) {
	return <NavigationMenuList className={cn(className)} {...props} />;
}

function NavbarMenuTrigger({ className, ...props }: React.ComponentProps<typeof NavigationMenuTrigger>) {
	return <NavigationMenuTrigger className={cn(className)} {...props} />;
}

export { NavbarMenu, NavbarMenuContent, NavbarMenuItem, NavbarMenuLink, NavbarMenuList, NavbarMenuTrigger };
