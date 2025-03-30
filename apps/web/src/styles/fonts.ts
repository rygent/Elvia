import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

export const calSans = localFont({
	src: '../fonts/CalSans-SemiBold.woff2',
	variable: '--font-cal-sans',
	weight: '600'
});

export const geistSans = GeistSans;
export const geistMono = GeistMono;
