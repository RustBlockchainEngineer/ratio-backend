
import express from 'express';

import 'dotenv/config'
import cors from 'cors';
import authMiddleware from './middlewares/auth';
import { Request, Response, NextFunction } from 'express';

import { cacheInit } from './api/cacheList'

//let whitelist = require('./routes/whitelist');
var url = require('url');

let platforms = require('./routes/platforms');
let lpairs = require('./routes/lpairs');
let tokens = require('./routes/tokens');
let ratioconfig = require('./routes/ratioconf');
let transactions = require('./routes/transactions');

let users = require('./routes/users');
let authRouter = require('./routes/auth');


const app = express();

app.use(express.json());

const allowedOrigins = process.env.API_CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
const options: cors.CorsOptions = {
    origin: allowedOrigins
};
app.use(cors(options));


const pathsToIgnore = [/\/auth(\/.*)?/, new RegExp("\/users\/[^\/]+")];

const applyMiddlewareByPathFilter = function (middleware: (req: Request, res: Response, next: NextFunction) => void, paths: RegExp[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (paths.some((pathRegex) => (url.parse(req.url).pathname as string).match(pathRegex))) {
            next();
        } else {
            middleware(req, res, next);
        }
    };
};

app.use(applyMiddlewareByPathFilter(authMiddleware.verifyToken, pathsToIgnore));
app.use(applyMiddlewareByPathFilter(authMiddleware.validateUser, pathsToIgnore));

app.use('/platforms', platforms);
app.use('/lpairs', lpairs);
app.use('/tokens', tokens);
app.use('/ratioconfig', ratioconfig);
app.use('/transaction', transactions);

app.use('/auth', authRouter);
app.use('/users', users);

// Init the tokens and LPs cache list;
cacheInit();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`rf-engine start on port ${port}.`);
});
