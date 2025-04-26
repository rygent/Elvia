import { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from 'http-errors';

// @ts-expect-error TS6133: 'req' is declared but its value is never read.
export default (error: HttpError, req: Request, res: Response, next: NextFunction) => {
	res.locals.message = error.message;
	const status = error.status || 500;

	const response = {
		status: status,
		message: res.locals.message || 'Internal Server Error'
	};

	res.status(status).json(response);

	next();
};
