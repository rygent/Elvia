import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const fontSans = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const fontMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const fontHeading = localFont({
	src: '../fonts/CalSans-SemiBold.woff2',
	variable: '--font-heading',
	weight: '600'
});
