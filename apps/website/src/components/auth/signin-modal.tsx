'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LoadingButton } from '@/components/loading-button';
import { siteConfig } from '@/config';
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
import { Discord } from '@elvia/ui/icons';
import { cn } from '@elvia/utils';
import { signIn } from 'next-auth/react';

export function SignInModal() {
	const [open, setOpen] = React.useState<boolean>(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="bg-transparent text-base shadow-none">
					Login
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex flex-col items-center gap-1 font-cal text-2xl">
						<Image
							alt={siteConfig.global.name}
							src={siteConfig.global.logo}
							width={44}
							height={44}
							className="rounded-full"
							aria-label={siteConfig.global.name}
						/>
						Sign in
					</DialogTitle>
					<DialogDescription className="text-center">Please sign in to your account to continue.</DialogDescription>
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
				<Discord className="mr-2" size={20} />
				Sign in with Discord
			</LoadingButton>
		</div>
	);
}
