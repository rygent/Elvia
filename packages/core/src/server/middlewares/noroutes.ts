import { type NextFunction, type Request, type Response } from 'express';
import createError from 'http-errors';

export default (_: Request, __: Response, next: NextFunction) => {
	next(createError(404));
};
