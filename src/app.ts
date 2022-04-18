import './pre-start';
import express, { Application, NextFunction, Request, Response } from 'express';
import logger from 'jet-logger';
import morgan from 'morgan';
import helmet from 'helmet';
import { apiErrorHandler } from './errors/api-error-handler';
import cors from 'cors';

const port: number = Number(process.env.PORT) || 3000;
const serverStartMsg: string = "Express server started on port: ";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}
if (process.env.NODE_ENV === 'prod') {
    app.use(helmet());
}

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello World!');
})

app.use(apiErrorHandler);

app.listen(port, () => {
    logger.info(serverStartMsg + port);
});