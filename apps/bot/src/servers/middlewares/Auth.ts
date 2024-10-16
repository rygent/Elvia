import type { NextFunction, Request, Response } from 'express';
import { Env } from '@/lib/Env.js';
import createError from 'http-errors';

export default (req: Request, _: Response, next: NextFunction): void => {
	const authorization = req.get('Authorization');

	if (authorization && authorization === Env.ClientApiAuth) next();
	else next(createError(401));
};
