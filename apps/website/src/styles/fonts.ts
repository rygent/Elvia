import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

export const fontHeading = localFont({
	src: '../assets/fonts/CalSans-SemiBold.woff2',
	variable: '--font-cal-sans'
});

export const geistSans = GeistSans;
export const geistMono = GeistMono;
