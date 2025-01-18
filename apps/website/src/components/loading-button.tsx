'use client';

import * as React from 'react';
import { LoadingDots } from '@/components/loading-dots';
import { Button, type ButtonProps } from '@elvia/ui';

interface LoadingButtonProps extends ButtonProps {
	loading?: boolean;
}

export function LoadingButton({ className, children, loading, ...props }: LoadingButtonProps) {
	return (
		<Button className={className} {...props}>
			{loading ? <LoadingDots /> : <>{children}</>}
		</Button>
	);
}
