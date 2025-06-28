import { type NextFunction, type Request, type Response } from 'express';

// @ts-expect-error TS6133: 'req' is declared but its value is never read.
export default (req: Request, res: Response, next: NextFunction) => {
	res.append('X-Frame-Options', 'deny');
	res.append('X-XSS-Protection', '1; mode=block');
	res.append('X-Content-Type-Options', 'nosniff');
	res.append('Content-Security-Policy', "script-src 'self'; object-src 'self'");
	res.append('X-Permitted-Cross-Domain-Policies', 'none');
	res.append('Referrer-Policy', 'no-referrer');

	next();
};
