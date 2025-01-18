'use client';

import * as React from 'react';
import Link from 'next/link';
import { Discord, Logo } from '@/components/icons';
import { LoadingButton } from '@/components/loading-button';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@elvia/ui';
import { cn } from '@elvia/utils';
import { signIn } from 'next-auth/react';

export function SignInModal() {
	const [open, setOpen] = React.useState<boolean>(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="h-8 bg-transparent text-base shadow-none">
					Log in
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex flex-col items-center gap-1 font-cal text-2xl">
						<Logo className="h-11 w-11" />
						Log in
					</DialogTitle>
					<DialogDescription className="text-center">Please log in to your account to continue.</DialogDescription>
				</DialogHeader>
				<AuthenticationForm />
				<DialogFooter className="mx-auto p-4 pt-0 sm:!justify-center">
					<p className="px-8 text-center text-sm text-muted-foreground">
						By clicking continue, you agree to our <br />
						<DialogClose asChild>
							<Link href="/legal/terms" className="underline underline-offset-4 hover:text-primary">
								Terms of Service
							</Link>
						</DialogClose>{' '}
						and{' '}
						<DialogClose asChild>
							<Link href="/legal/privacy" className="underline underline-offset-4 hover:text-primary">
								Privacy Policy
							</Link>
						</DialogClose>
						.
					</p>
				</DialogFooter>
			</DialogContent>
		</Dialog>
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
