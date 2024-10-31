'use client';

import * as React from 'react';
import { renderComponent } from '@/utils/render';
import { Button, X } from '@elvia/ui';

interface BannerProps {
	text: React.ReactNode | React.FC;
	dismissable?: boolean;
}

export function Banner({ text, dismissable = false }: BannerProps) {
	if (!text) return null;

	const [displayed, setDisplayed] = React.useState(true);
	if (!displayed) return null;

	return (
		<>
			<div className="relative top-0 z-20 flex h-10 items-center overflow-hidden bg-card px-8 print:hidden [body.banner_&]:hidden">
				{/* Background */}
				<div
					className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl dark:opacity-40"
					aria-hidden="true"
				>
					<div
						className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
						style={{
							clipPath:
								'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)'
						}}
					/>
				</div>
				<div
					className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl dark:opacity-40"
					aria-hidden="true"
				>
					<div
						className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
						style={{
							clipPath:
								'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)'
						}}
					/>
				</div>
				<p className="w-full truncate px-4 text-center text-sm font-medium leading-6">{renderComponent(text)}</p>
				{dismissable && (
					<div className="flex flex-1 justify-end">
						<Button
							aria-label="Dismiss banner"
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							onClick={() => {
								setDisplayed(false);
							}}
						>
							<X size={18} aria-hidden="true" />
						</Button>
					</div>
				)}
			</div>
		</>
	);
}
