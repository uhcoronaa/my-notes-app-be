import { NextFunction, Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import get from "lodash/get";
import omit from "lodash/omit";
import { User } from "../models/user/user.model";
import { ApiError } from "../errors/api-error";
import { decrypt, decrypt2, encrypt } from "../utils/cipher";
import { generateAccessToken, generateRefreshToken, tokenMiddleware } from "../utils/jwt";
import { verify, VerifyErrors } from "jsonwebtoken";
import { IUser } from "../models/user/user.interface";
import mongoose from "mongoose";

const userRouter = Router();
const { OK, UNAUTHORIZED, FORBIDDEN } = StatusCodes;

userRouter.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, username, password, image } = req.body;
    const decryptedUiPassword = decrypt2(password);

    const encryptedPassword = encrypt(decryptedUiPassword);
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
                const accessToken = generateAccessToken({ ...omit(user, ['password']), _id: userCreated._id });
                const refreshToken = generateRefreshToken({ ...omit(user, ['password']), _id: userCreated._id });
                res.status(OK).json({ accessToken, refreshToken, user: { ...omit(user, ['password']), _id: userCreated._id } });
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
    const decryptedUiPassword = decrypt2(password);
    User.findOne({ username }).then((userFound) => {
        if (!userFound) {
            res.status(UNAUTHORIZED).json({ message: 'Invalid credentials' });
            return;
        }
        const { firstName, lastName, username, _id, image } = userFound;
        const user = { firstName, lastName, username, _id, image };
        const decryptedPassword = decrypt(get(userFound, 'password', ''));
        if (decryptedPassword === decryptedUiPassword) {
            const accessToken = generateAccessToken(omit(user, ['image']));
            const refreshToken = generateRefreshToken(omit(user, ['image']));
            res.status(OK).json({ accessToken, refreshToken, user });
        }
        else {
            res.status(UNAUTHORIZED).json({ message: 'Invalid password' });
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
            User.updateOne(condition, valueUpdated, {}, (err, user) => {
                const { firstName, lastName, username, image } = valueUpdated;
                const userToken = { firstName, lastName, username, _id: new mongoose.Types.ObjectId(id), image };
                const accessToken = generateAccessToken(omit(userToken, ['image']));
                const refreshToken = generateRefreshToken(omit(userToken, ['image']));
                res.status(OK).json({ accessToken, refreshToken, user: userToken });
            });
        }
    });
});

userRouter.patch('/change-password/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { password } = req.body;
    const decryptedUIPassword = decrypt2(password);
    const encryptedPassword = encrypt(decryptedUIPassword);
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
                    const { firstName, lastName, username, image } = userFound;
                    const userToken = { firstName, lastName, username, _id: new mongoose.Types.ObjectId(id), image };
                    const accessToken = generateAccessToken(omit(userToken, ['image']));
                    const refreshToken = generateRefreshToken(omit(userToken, ['image']));
                    res.status(OK).json({ accessToken, refreshToken, user: userToken });
                });
            });
        }
    });
});

export default userRouter;