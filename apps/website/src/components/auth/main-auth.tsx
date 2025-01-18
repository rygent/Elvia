'use client';

import { SignInModal } from '@/components/auth/signin-modal';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@elvia/ui';
import { signOut, useSession } from 'next-auth/react';

export function MainAuth() {
	const { status } = useSession();
	const isDesktop = useMediaQuery('(min-width: 768px)');

	if (!isDesktop) {
		return null;
	}

	if (status === 'authenticated') {
		return (
			<Button
				variant="outline"
				className="bg-transparent text-base shadow-none"
				onClick={() => signOut({ redirect: false })}
			>
				Logout
			</Button>
		);
	}

	return <SignInModal />;
}
