import { NextFunction, Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import get from "lodash/get";
import omit from "lodash/omit";
import { User } from "../models/user/user.model";
import { ApiError } from "../errors/api-error";
import { decrypt, encrypt } from "../utils/cipher";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { verify, VerifyErrors } from "jsonwebtoken";
import { IUser } from "../models/user/user.interface";

const userRouter = Router();
const { OK, UNAUTHORIZED, FORBIDDEN } = StatusCodes;

userRouter.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, username, password } = req.body;
    const encryptedPassword = encrypt(password);
    const user = {
        firstName,
        lastName,
        username,
        password: encryptedPassword
    };

    User.findOne({ username }).then((userFound) => {
        if (!userFound) {
            User.create(user).then((userCreated) => {
                const secret: string = get(process, 'env.TOKEN_SECRET', '');
                const accessToken = generateAccessToken({...omit(user, ['password']), _id: userCreated._id});
                const refreshToken = generateAccessToken({...omit(user, ['password']), _id: userCreated._id});
                res.status(OK).json({ accessToken, refreshToken, user: omit(user, ['password']) });
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
    const secret: string = get(process, 'env.TOKEN_SECRET', '');
    User.findOne({ username }).then((userFound) => {
        if (!userFound) {
            res.status(UNAUTHORIZED).json({ message: 'Invalid credentials' });
            return;
        }
        const { firstName, lastName, username, _id } = userFound;
        const user = { firstName, lastName, username, _id };
        const decryptedPassword = decrypt(get(userFound, 'password', ''));
        if (decryptedPassword === password) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
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
        if (err || !user) return res.status(FORBIDDEN);
        const { firstName, lastName, username, _id } = user as IUser;
        const accessToken = generateAccessToken({ firstName, lastName, username, _id });
        res.status(OK).send({ accessToken });
    });
});

export default userRouter;