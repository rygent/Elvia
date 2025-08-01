import { type NextFunction, type Request, type Response } from 'express';
import { createError } from '@elvia/core';
import { env } from '@/env.js';

export default (req: Request, _: Response, next: NextFunction): void => {
	const authorization = req.get('Authorization');

	if (authorization && authorization === env.SERVER_API_AUTH) next();
	else next(createError(401));
};
