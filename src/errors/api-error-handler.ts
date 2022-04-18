import { NextFunction, Request, Response } from 'express';
import { ApiError } from './api-error';
import StatusCodes from 'http-status-codes';

export function apiErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ApiError) {
        const error: { statusCode: number, messages: string[] } = {
            statusCode: err.code,
            messages: err.messages
        }
        res.status(err.code).json(error);
        return;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Something went wrong');
}