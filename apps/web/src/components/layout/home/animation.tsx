'use client';

import * as React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@elvia/ui';
import { cn } from '@elvia/utils';
import { LayoutGroup, motion } from 'motion/react';

export function Animation() {
	const [selectedTab, setSelectedTab] = React.useState(0);
	const [animationStarted, setAnimationStarted] = React.useState(false);

	React.useEffect(() => {
		const interval = setInterval(() => {
			setSelectedTab((prevTab) => (prevTab + 1) % 4); // Modulo 5 to cycle through tabs
			// start animation
			if (!animationStarted) setAnimationStarted(true);
		}, 3000);

		return () => clearInterval(interval);
	}, [animationStarted]);

	const animationProps = {
		initial: { y: 12, opacity: 0 },
		animate: { y: 0, opacity: 1 },
		transition: { duration: 0.5 },
		layoutId: 'underline'
	};

	return (
		<div>
			<LayoutGroup>
				{selectedTab === 0 && (
					<motion.div
						key={0}
						{...(animationStarted ? animationProps : { layoutId: 'underline' })}
						className={cn(
							'h-[450px] w-[350px]',
							!animationStarted && 'animate-in duration-500 fade-in slide-in-from-bottom-3'
						)}
					>
						<h2 className="font-cal text-3xl font-bold">fun.</h2>
						<div className="mt-4 grid grid-cols-1 gap-4">
							{['/8ball', '/rps', '/trivia'].map((hookName, i) => (
								<Card key={i} className="py-4">
									<CardHeader className="px-4">
										<CardTitle className="text-xl">{hookName}</CardTitle>
										<CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</motion.div>
				)}
				{selectedTab === 1 && (
					<motion.div key={1} {...animationProps} className="h-[450px] w-[350px]">
						<h2 className="font-cal text-3xl font-bold">moderation.</h2>
						<div className="mt-4 grid grid-cols-1 gap-4">
							{['/purge messages', '/ban', '/timeout'].map((hookName, i) => (
								<Card key={i} className="py-4">
									<CardHeader className="px-4">
										<CardTitle className="text-xl">{hookName}</CardTitle>
										<CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</motion.div>
				)}
				{selectedTab === 2 && (
					<motion.div key={2} {...animationProps} className="h-[450px] w-[350px]">
						<h2 className="font-cal text-3xl font-bold">social.</h2>
						<div className="mt-4 grid grid-cols-1 gap-4">
							{['/image cuddle', '/image kiss', '/image hug'].map((hookName, i) => (
								<Card key={i} className="py-4">
									<CardHeader className="px-4">
										<CardTitle className="text-xl">{hookName}</CardTitle>
										<CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</motion.div>
				)}
				{selectedTab === 3 && (
					<motion.div key={3} {...animationProps} className="h-[450px] w-[350px]">
						<h2 className="font-cal text-3xl font-bold">utilities.</h2>
						<div className="mt-4 grid grid-cols-1 gap-4">
							{['/search anime', '/search manga', '/translate'].map((hookName, i) => (
								<Card key={i} className="py-4">
									<CardHeader className="px-4">
										<CardTitle className="text-xl">{hookName}</CardTitle>
										<CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</motion.div>
				)}
			</LayoutGroup>
		</div>
	);
}
