import StatusCodes from 'http-status-codes';
import logger from 'jet-logger';

export class ApiError {

    code: number;
    messages: string[];

    constructor(code: number, messages: string[]) {
        this.code = code;
        this.messages = messages;
    }

    static badRequest(messages: string[]): ApiError {
        const error = new ApiError(StatusCodes.BAD_REQUEST, messages);
        logger.err(JSON.stringify(error));
        return error;
    }

    static internalError(messages: string[]): ApiError {
        const error = new ApiError(StatusCodes.BAD_REQUEST, messages);
        logger.err(JSON.stringify(error));
        return error;
    }

}
