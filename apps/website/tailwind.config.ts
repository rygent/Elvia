// tailwind config is required for editor support
import sharedConfig from '@elvia/ui/tailwind.config.ts';
import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config = {
	content: ['./src/**/*.{md,mdx,ts,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)', ...fontFamily.sans],
				mono: ['var(--font-geist-mono)', ...fontFamily.mono],
				cal: ['var(--font-cal-sans)', ...fontFamily.sans]
			}
		}
	},
	presets: [sharedConfig]
} satisfies Config;

export default config;
