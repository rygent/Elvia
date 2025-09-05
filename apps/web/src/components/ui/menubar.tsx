'use client';

import * as React from 'react';
import { Link } from '@/components/link';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from '@elvia/ui';
import { cn } from '@elvia/utils';

function MenuBar({ className, ...props }: React.ComponentProps<typeof NavigationMenuItem>) {
	return <NavigationMenuItem className={cn(className)} {...props} />;
}

function MenuBarContent({ className, ...props }: React.ComponentProps<typeof NavigationMenuContent>) {
	return <NavigationMenuContent className={cn('flex flex-col p-4', className)} {...props} />;
}

function MenuBarLink({ className, href, children, ...props }: React.ComponentProps<typeof NavigationMenuLink>) {
	return (
		<NavigationMenuLink className={cn('flex flex-row transition-colors', className)} asChild {...props}>
			<Link href={href}>{children}</Link>
		</NavigationMenuLink>
	);
}

function MenuBarTrigger({ className, ...props }: React.ComponentProps<typeof NavigationMenuTrigger>) {
	return <NavigationMenuTrigger className={cn(className)} onPointerMove={(e) => e.preventDefault()} {...props} />;
}

export { MenuBar, MenuBarContent, MenuBarLink, MenuBarTrigger };
