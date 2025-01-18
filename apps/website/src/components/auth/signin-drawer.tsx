'use client';

import * as React from 'react';
import Link from 'next/link';
import { Discord, Logo } from '@/components/icons';
import { LoadingButton } from '@/components/loading-button';
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	PopoverClose
} from '@elvia/ui';
import { cn } from '@elvia/utils';
import { signIn } from 'next-auth/react';

export function SignInDrawer() {
	const [open, setOpen] = React.useState<boolean>(false);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="default" className="h-10 w-full text-base shadow-none">
					Log in
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle className="flex flex-col items-center gap-1 font-cal text-2xl">
						<Logo className="h-11 w-11" />
						Log in
					</DrawerTitle>
					<DrawerDescription className="text-center">Please log in to your account to continue.</DrawerDescription>
				</DrawerHeader>
				<AuthenticationForm className="px-4" />
				<DrawerFooter className="pt-2">
					<p className="px-8 text-center text-sm text-muted-foreground">
						By clicking continue, you agree to our <br />
						<DrawerClose asChild>
							<PopoverClose asChild>
								<Link href="/legal/terms" className="underline underline-offset-4 hover:text-primary">
									Terms of Service
								</Link>
							</PopoverClose>
						</DrawerClose>{' '}
						and{' '}
						<DrawerClose asChild>
							<PopoverClose asChild>
								<Link href="/legal/privacy" className="underline underline-offset-4 hover:text-primary">
									Privacy Policy
								</Link>
							</PopoverClose>
						</DrawerClose>
						.
					</p>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

function AuthenticationForm({ className }: React.ComponentProps<'div'>) {
	const [loading, setLoading] = React.useState<boolean>(false);

	return (
		<div className={cn('grid items-start gap-4', className)}>
			<LoadingButton
				loading={loading}
				onClick={() => {
					setLoading(true);
					void signIn('discord', {
						redirect: false
					});
				}}
			>
				<Discord className="mr-2 h-5 w-5" />
				Continue with Discord
			</LoadingButton>
		</div>
	);
}
