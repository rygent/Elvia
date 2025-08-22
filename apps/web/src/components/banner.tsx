'use client';

import * as React from 'react';
import { Button } from '@elvia/ui';
import { cn } from '@elvia/utils';
import { X } from 'lucide-react';

interface BannerProps {
	dismissable?: boolean;
}

export function Banner({ dismissable = false }: BannerProps) {
	return (
		<>
			<script
				dangerouslySetInnerHTML={{
					__html: `
						try {
							if (localStorage.getItem('banner') === 'hidden') {
								document.body.classList.add('banner');
							}
						} catch (_) {}
					`
				}}
			/>
			<div className="relative top-0 z-20 flex h-10 items-center overflow-hidden bg-card px-6 max-md:px-4 print:hidden [body.banner_&]:hidden">
				{/* Background */}
				<div
					className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl dark:opacity-40"
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
					className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl dark:opacity-40"
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
				<div className="mx-auto inline-flex w-full max-w-7xl items-center gap-x-1">
					<p
						className={cn('w-full truncate text-center text-sm leading-6 font-medium', {
							'max-md:text-start': dismissable
						})}
					>
						We are going live soon! Get notified when launched.
					</p>
					{dismissable && (
						<div className="flex flex-1 justify-end">
							<Button
								aria-label="Dismiss banner"
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={() => {
									try {
										localStorage.setItem('banner', 'hidden');
									} catch {
										/* empty */
									}
									document.body.classList.add('banner');
								}}
							>
								<X size={18} aria-hidden="true" />
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
