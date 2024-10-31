// tailwind config is required for editor support
import sharedConfig from '@elvia/ui/tailwind.config.ts';
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
	content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)', ...fontFamily.sans],
				mono: ['var(--font-geist-mono)', ...fontFamily.mono],
				heading: ['var(--font-cal-sans)', ...fontFamily.sans]
			}
		}
	},
	presets: [sharedConfig]
} satisfies Config;

export default config;
