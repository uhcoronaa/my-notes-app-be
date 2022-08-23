import { NextFunction, Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import get from "lodash/get";
import omit from "lodash/omit";
import { User } from "../models/user/user.model";
import { ApiError } from "../errors/api-error";
import { encrypt, compare } from "../utils/cipher";
import { generateAccessToken, generateRefreshToken, tokenMiddleware } from "../utils/jwt";
import { verify, VerifyErrors } from "jsonwebtoken";
import { IUser } from "../models/user/user.interface";
import mongoose from "mongoose";

const userRouter = Router();
const { OK, UNAUTHORIZED, FORBIDDEN } = StatusCodes;

userRouter.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, username, password, image } = req.body;
    const encryptedPassword = encrypt(password);
    const user = {
        firstName,
        lastName,
        username,
        password: encryptedPassword,
        image
    };

    User.findOne({ username }).then((userFound) => {
        if (!userFound) {
            User.create(user).then((userCreated) => {
                const accessToken = generateAccessToken({ ...omit(user, ['password', 'image']), _id: userCreated._id });
                const refreshToken = generateRefreshToken({ ...omit(user, ['password', 'image']), _id: userCreated._id });
                res.status(OK).json({ accessToken, refreshToken, user: { ...omit(user, ['password, image']), _id: userCreated._id } });
            }, (err: Error) => {
                next(ApiError.internalError(['INTERNAL_SERVER_ERROR']));
            });
        }
        else {
            next(ApiError.badRequest(['DUPLICATED_USERNAME']))
        }
    });


});

userRouter.post('/login', (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: { username: string, password: string } = req.body;
    User.findOne({ username }).then((userFound) => {
        if (!userFound) {
            res.status(UNAUTHORIZED).json({ messages: ['USER_NOT_FOUND'] });
            return;
        }
        const { firstName, lastName, username, _id, image } = userFound;
        const user = { firstName, lastName, username, _id };
        if (compare(password, get(userFound, 'password', ''))) {
            const accessToken = generateAccessToken(omit(user, ['image']));
            const refreshToken = generateRefreshToken(omit(user, ['image']));
            res.status(OK).json({ accessToken, refreshToken, user });
        }
        else {
            res.status(UNAUTHORIZED).json({ messages: ['INVALID_PASSWORD'] });
        }
    });
});

userRouter.post('/refresh-token', (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken }: { refreshToken: string } = req.body;
    const secret: string = get(process, 'env.TOKEN_SECRET', '');
    if (!refreshToken) return res.sendStatus(UNAUTHORIZED);
    verify(refreshToken, secret, (err: VerifyErrors | null, user: Object | undefined | Partial<IUser>) => {
        if (err || !user) return res.status(FORBIDDEN).send();
        const { firstName, lastName, username, _id } = user as IUser;
        const accessToken = generateAccessToken({ firstName, lastName, username, _id });
        res.status(OK).send({ accessToken });
    });
});

userRouter.patch('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { firstName, lastName, image, username } = req.body;
    const valueUpdated = {
        firstName,
        lastName,
        image,
        username
    };
    const condition = {
        _id: id
    }
    User.findOne(condition).then((userFound) => {
        if (!userFound) {
            next(ApiError.badRequest(['NON_EXISTENT_USER']));
        }
        else {
            User.findOne({ username: username, _id: { $ne: id } }).then((duplicatedUser) => {
                if (duplicatedUser) {
                    next(ApiError.badRequest(['DUPLICATED_USERNAME']));
                }
                else {
                    User.updateOne(condition, valueUpdated, {}, (err, user) => {
                        const { firstName, lastName, username } = valueUpdated;
                        const userToken = { firstName, lastName, username, _id: new mongoose.Types.ObjectId(id) };
                        const accessToken = generateAccessToken(omit(userToken, ['image']));
                        const refreshToken = generateRefreshToken(omit(userToken, ['image']));
                        res.status(OK).json({ accessToken, refreshToken, user: userToken });
                    });
                }
            });
        }
    });
});

userRouter.patch('/change-password/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { password } = req.body;
    const encryptedPassword = encrypt(password);
    const valueUpdated = {
        password: encryptedPassword
    };
    const condition = {
        _id: id
    }
    User.findOne(condition).then((userFound) => {
        if (!userFound) {
            next(ApiError.badRequest(['NON_EXISTENT_USER']));
        }
        else {
            User.findOne({ _id: id }).then((userFound: any) => {
                User.updateOne(condition, valueUpdated, {}, (err, user) => {
                    const { firstName, lastName, username } = userFound;
                    const userToken = { firstName, lastName, username, _id: new mongoose.Types.ObjectId(id) };
                    const accessToken = generateAccessToken(omit(userToken, ['image']));
                    const refreshToken = generateRefreshToken(omit(userToken, ['image']));
                    res.status(OK).json({ accessToken, refreshToken, user: userToken });
                });
            });
        }
    });
});

userRouter.get('/image/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const condition = {
        _id: id
    }
    User.findOne(condition).then((userFound) => {
        if (!userFound) {
            next(ApiError.badRequest(['NON_EXISTENT_USER']));
        }
        else {
            res.status(OK).json({ image: userFound.image });
        }
    });
});

export default userRouter;