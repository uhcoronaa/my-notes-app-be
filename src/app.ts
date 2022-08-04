import './pre-start';
import express, { Application } from 'express';
import logger from 'jet-logger';
import morgan from 'morgan';
import helmet from 'helmet';
import { apiErrorHandler } from './errors/api-error-handler';
import apiRouter from './routes/api';
import mongoose from 'mongoose';
import get from 'lodash/get';
import cors from 'cors';

const port: number = Number(process.env.PORT) || 3000;
const serverStartMsg: string = "Express server started on port: ";

const app: Application = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}
if (process.env.NODE_ENV === 'prod') {
    app.use(helmet());
}

app.use('/api', apiRouter);
app.use(apiErrorHandler);

const connect = mongoose.connect(get(process, 'env.MONGO_DB_URL', ''));
connect.then((db) => {
    logger.info('Connected correctly to DB');
}, (err) => {
    logger.err(err);
});

app.listen(port, () => {
    logger.info(serverStartMsg + port);
});