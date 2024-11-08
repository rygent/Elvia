import type { NextFunction, Request, Response } from 'express';
import { env } from '@/env.js';
import createError from 'http-errors';

export default (req: Request, _: Response, next: NextFunction): void => {
	const authorization = req.get('Authorization');

	if (authorization && authorization === env.SERVER_AUTH) next();
	else next(createError(401));
};
