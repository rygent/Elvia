import type { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

export default (_: Request, __: Response, next: NextFunction) => {
	next(createError(404));
};
