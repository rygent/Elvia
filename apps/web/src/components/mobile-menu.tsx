'use client';

import * as React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, ScrollArea } from '@elvia/ui';
import { cn } from '@elvia/utils';
import { Portal } from '@radix-ui/react-portal';
import { ExternalLink } from 'lucide-react';

export function MobileMenu({ className, ...props }: React.ComponentProps<typeof Button>) {
	const [open, setOpen] = React.useState<boolean>(false);
	const toggleMenu = () => setOpen(!open);
	const closeMenu = () => setOpen(false);

	React.useEffect(() => {
		const mediaQueryList = window.matchMedia('(min-width: 1024px)');

		const handleChange = () => {
			setOpen((isOpen) => (isOpen ? !mediaQueryList.matches : false));
		};

		handleChange();
		mediaQueryList.addEventListener('change', handleChange);
		return () => mediaQueryList.removeEventListener('change', handleChange);
	}, []);

	React.useEffect(() => {
		if (open) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
	}, [open]);

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				data-state={getState(open)}
				className={cn(
					'group relative flex h-8 w-8 flex-col gap-0 rounded-full border ps-[6px] pe-[6px] duration-200 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden',
					className
				)}
				onClick={toggleMenu}
				{...props}
			>
				<div
					data-position="top"
					className="absolute h-[1.5px] w-[14px] translate-y-[-3.5px] bg-foreground transition-transform group-data-[state=open]:translate-y-0 group-data-[state=open]:scale-110 group-data-[state=open]:rotate-45"
					style={{ transitionDuration: '160ms', transitionTimingFunction: 'cubic-bezier(0.31,0.05,0.43,1.02)' }}
				></div>
				<div
					data-position="bottom"
					className="absolute h-[1.5px] w-[14px] translate-y-[3.5px] bg-foreground transition-transform group-data-[state=open]:translate-y-0 group-data-[state=open]:scale-110 group-data-[state=open]:-rotate-45"
					style={{ transitionDuration: '160ms', transitionTimingFunction: 'cubic-bezier(0.31,0.05,0.43,1.02)' }}
				></div>
			</Button>
			{open && (
				<Portal
					className={cn(
						'fixed top-14 right-0 z-50 flex h-dvh w-screen flex-col overflow-visible bg-background/95 px-3 backdrop-blur transition-transform supports-[backdrop-filter]:bg-background/90'
					)}
				>
					<ScrollArea>
						<section className="my-3 px-3">
							<Button variant="default" className="h-10 w-full text-base shadow-none" onClick={closeMenu}>
								Support
							</Button>
						</section>
						<section className="py-3">
							<Accordion type="multiple" className="px-3">
								<AccordionItem value="resources" className="border-none">
									<AccordionTrigger className="h-10 py-2 text-base text-muted-foreground hover:no-underline">
										Resources
									</AccordionTrigger>
									<AccordionContent className="pb-0">
										<Button
											variant="link"
											className="h-10 w-full justify-start px-0 text-base text-muted-foreground hover:text-foreground hover:no-underline"
											onClick={closeMenu}
											asChild
										>
											<Link href="/">Commands</Link>
										</Button>
										<Button
											variant="link"
											className="h-10 w-full justify-start px-0 text-base text-muted-foreground hover:text-foreground hover:no-underline"
											onClick={closeMenu}
											asChild
										>
											<Link href="/">Blog</Link>
										</Button>
										<Button
											variant="link"
											className="h-10 w-full justify-start px-0 text-base text-muted-foreground hover:text-foreground hover:no-underline"
											onClick={closeMenu}
											asChild
										>
											<Link href="/">Changelog</Link>
										</Button>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="legal" className="border-none">
									<AccordionTrigger className="h-10 py-2 text-base text-muted-foreground hover:no-underline">
										Legal
									</AccordionTrigger>
									<AccordionContent className="pb-0">
										<Button
											variant="link"
											className="h-10 w-full justify-start px-0 text-base text-muted-foreground hover:text-foreground hover:no-underline"
											onClick={closeMenu}
											asChild
										>
											<Link href="/legal/terms">Terms of Service</Link>
										</Button>
										<Button
											variant="link"
											className="h-10 w-full justify-start px-0 text-base text-muted-foreground hover:text-foreground hover:no-underline"
											onClick={closeMenu}
											asChild
										>
											<Link href="/legal/privacy">Privacy Policy</Link>
										</Button>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<Button
								variant="link"
								className="h-10 w-full justify-start px-3 text-base text-muted-foreground hover:text-foreground hover:no-underline"
								onClick={closeMenu}
								asChild
							>
								<Link href={siteConfig.external.links.topgg} className="gap-1" target="_blank" rel="noreferrer">
									Vote on Top.gg
									<ExternalLink size={14} strokeWidth={1.5} />
								</Link>
							</Button>
						</section>
					</ScrollArea>
				</Portal>
			)}
		</>
	);
}

function getState(open: boolean) {
	return open ? 'open' : 'closed';
}
