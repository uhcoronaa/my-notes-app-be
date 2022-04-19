import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sign, verify, VerifyErrors } from "jsonwebtoken";
import { get, set } from "lodash";
import { IUser } from "../models/user/user.interface";

const { OK, UNAUTHORIZED, FORBIDDEN } = StatusCodes;

function generateAccessToken(user: Partial<IUser>) {
    try {
        const secret: string = get(process, 'env.TOKEN_SECRET', '');
        const accessToken = sign(user, secret, { expiresIn: '120000' });
        return accessToken;
    }
    catch (err) {
        return new Error('JWT_ERROR');
    }
}

function generateRefreshToken(user: Partial<IUser>) {
    const secret: string = get(process, 'env.TOKEN_SECRET', '');
    const accessToken = sign(user, secret);
    return accessToken;
}

function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = get(req, 'headers.authorization', '');
    const token = get(authHeader.split(' '), '[1]', null);
    const secret: string = get(process, 'env.TOKEN_SECRET', '');
    if (!token) return res.send(UNAUTHORIZED);
    verify(token, secret, (err: VerifyErrors | null, user: Object | undefined) => {
        if (err) return res.send(FORBIDDEN);
        set(req, 'body.jwtUser', user);
        next();
    });
}

export { generateAccessToken, tokenMiddleware, generateRefreshToken }