import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme.js';

const config: Config = {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)'
			},
			fontFamily: {
				sans: ['var(--font-geist-sans)', ...fontFamily.sans],
				mono: ['var(--font-geist-mono)', ...fontFamily.mono]
			}
		}
	},
	plugins: []
};
export default config;
