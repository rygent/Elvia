'use client';

import { SignInDrawer } from '@/components/auth/signin-drawer';
import { Button, PopoverClose } from '@elvia/ui';
import { signOut, useSession } from 'next-auth/react';

export function MobileAuth() {
	const { status } = useSession();

	if (status === 'authenticated') {
		return (
			<PopoverClose asChild>
				<Button
					variant="default"
					className="h-10 w-full text-base shadow-none"
					onClick={() => signOut({ redirect: false })}
				>
					Logout
				</Button>
			</PopoverClose>
		);
	}

	return <SignInDrawer />;
}
