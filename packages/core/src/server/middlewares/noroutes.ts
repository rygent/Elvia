import { type NextFunction, type Request, type Response } from 'express';
import createError from 'http-errors';

// @ts-expect-error TS6133: 'req' & 'res' is declared but its value is never read.
export default (req: Request, res: Response, next: NextFunction) => {
	next(createError(404));
};
