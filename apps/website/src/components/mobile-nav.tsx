'use client';

import * as React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
	ExternalLink,
	Hamburger,
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
	ScrollArea
} from '@elvia/ui';
import { cn } from '@elvia/utils';
import '@/styles/hamburger.css';

export function MobileNav() {
	const [isOpen, setIsOpen] = React.useState(false);

	React.useEffect(() => {
		if (isOpen) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
	}, [isOpen]);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="hamburger focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden [&_svg]:size-5"
				>
					<Hamburger size={24} className={cn({ open: isOpen })} />
					<span className="sr-only">Menu</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="z-40 h-[calc(100vh-4.0625rem)] w-screen animate-none rounded-none border-none bg-background/90 p-0 px-3 shadow-none backdrop-blur transition-transform supports-[backdrop-filter]:bg-background/90 md:hidden">
				<ScrollArea>
					<section className="my-3 px-3">
						<PopoverClose asChild>
							<Button variant="default" className="w-full shadow-none">
								Support
							</Button>
						</PopoverClose>
					</section>
					<section className="py-3">
						<Accordion type="multiple" className="px-3">
							<AccordionItem value="resources" className="border-none">
								<AccordionTrigger className="py-2 text-muted-foreground hover:no-underline">Resources</AccordionTrigger>
								<AccordionContent className="pb-0">
									<PopoverClose asChild>
										<Button
											variant="link"
											className="w-full justify-start px-0 text-muted-foreground hover:text-foreground hover:no-underline"
											asChild
										>
											<Link href="/">Commands</Link>
										</Button>
									</PopoverClose>
									<PopoverClose asChild>
										<Button
											variant="link"
											className="w-full justify-start px-0 text-muted-foreground hover:text-foreground hover:no-underline"
											asChild
										>
											<Link href="/">Blog</Link>
										</Button>
									</PopoverClose>
									<PopoverClose asChild>
										<Button
											variant="link"
											className="w-full justify-start px-0 text-muted-foreground hover:text-foreground hover:no-underline"
											asChild
										>
											<Link href="/">Changelog</Link>
										</Button>
									</PopoverClose>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="legal" className="border-none">
								<AccordionTrigger className="py-2 text-muted-foreground hover:no-underline">Legal</AccordionTrigger>
								<AccordionContent className="pb-0">
									<PopoverClose asChild>
										<Button
											variant="link"
											className="w-full justify-start px-0 text-muted-foreground hover:text-foreground hover:no-underline"
											asChild
										>
											<Link href="/">Terms of Service</Link>
										</Button>
									</PopoverClose>
									<PopoverClose asChild>
										<Button
											variant="link"
											className="w-full justify-start px-0 text-muted-foreground hover:text-foreground hover:no-underline"
											asChild
										>
											<Link href="/">Privacy Policy</Link>
										</Button>
									</PopoverClose>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<PopoverClose asChild>
							<Button
								variant="link"
								className="w-full justify-start px-3 text-muted-foreground hover:text-foreground hover:no-underline"
								asChild
							>
								<Link href={siteConfig.external.links.topgg} className="gap-1" target="_blank" rel="noreferrer">
									Vote on Top.gg
									<ExternalLink size={14} strokeWidth={1.5} />
								</Link>
							</Button>
						</PopoverClose>
					</section>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
