'use client';

import * as React from 'react';
import {
  buttonVariants,
  Monitor,
  Moon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sun
} from '@elvia/ui';
import { cn } from '@elvia/utils';
import { useTheme } from 'next-themes';

const themes = [
  { icon: <Sun strokeWidth={1.5} />, name: 'Light' },
  { icon: <Moon strokeWidth={1.5} />, name: 'Dark' },
  { icon: <Monitor strokeWidth={1.5} />, name: 'System' }
];

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [mounted, setMounted] = React.useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Select defaultValue={theme} onValueChange={setTheme}>
      <SelectTrigger
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'flex w-[150px] items-center gap-2 shadow-none [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          className
        )}
        aria-label="Select theme"
      >
        <SelectValue>
          {themes.find(({ name }) => name.toLowerCase() === theme)?.icon}
          <span className="ml-2">{themes.find(({ name }) => name.toLowerCase() === theme)?.name}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {themes.map(({ name, icon }) => (
          <SelectItem key={name.toLowerCase()} value={name.toLowerCase()}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {icon}
              {name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
