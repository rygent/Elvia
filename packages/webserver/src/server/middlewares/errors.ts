import type { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

export default (err: HttpError, _: Request, res: Response, next: NextFunction) => {
	res.locals.message = err.message;
	const status = err.status || 500;

	const response = {
		status: status,
		message: res.locals.message || 'Internal Server Error'
	};
	res.status(status).json(response);

	next();
};
