import type { NextFunction, Request, Response } from 'express';

export default (_: Request, res: Response, next: NextFunction) => {
	res.append('X-Frame-Options', 'deny');
	res.append('X-XSS-Protection', '1; mode=block');
	res.append('X-Content-Type-Options', 'nosniff');
	res.append('Content-Security-Policy', "script-src 'self'; object-src 'self'");
	res.append('X-Permitted-Cross-Domain-Policies', 'none');
	res.append('Referrer-Policy', 'no-referrer');
	res.append('via', 'starlink');
	res.append('X-Powered-By', 'Tesseract');
	next();
};
