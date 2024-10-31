import * as React from 'react';
import Link from 'next/link';
import { Animation } from '@/components/marketing/hero/animation';
import { siteConfig } from '@/config';
import { ArrowRight, badgeVariants, Button, Sparkles } from '@elvia/ui';
import { cn } from '@elvia/utils';
// eslint-disable-next-line import/no-named-as-default
import Balancer from 'react-wrap-balancer';

interface HeroProps {
  headline: string;
  subheadline: string;
  cta: {
    label: string;
    href: string;
  }[];
}

export function Hero({ headline, subheadline, cta }: HeroProps) {
  return (
    <section className="mx-auto flex max-w-7xl items-start justify-between">
      <div className="pt-4">
        <Link
          href={siteConfig.external.links.github}
          target="_blank"
          className={cn(
            badgeVariants({ variant: 'outline' }),
            'cursor-pointer space-x-2 rounded-full font-mono delay-75 duration-200 hover:bg-secondary'
          )}
        >
          <Sparkles size={18} strokeWidth={1.5} className="scale-x-[-1]" />
          <span>Star us on GitHub</span> <ArrowRight size={15} strokeWidth={1.5} />
        </Link>
        <h1 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          <Balancer>{headline.split('\n')}</Balancer>
        </h1>
        <h2 className="text-md mt-6 text-muted-foreground md:text-lg lg:text-xl">{subheadline}</h2>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          {cta[0] && (
            <Button size="lg" variant="default" asChild>
              <Link href={cta[0].href}>{cta[0].label}</Link>
            </Button>
          )}
          {cta[1] && (
            <Button size="lg" variant="outline" asChild>
              <Link href={cta[1].href}>{cta[1].label}</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="hidden px-10 lg:block xl:px-20">
        <Animation />
      </div>
    </section>
  );
}
