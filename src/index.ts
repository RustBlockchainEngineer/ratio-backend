import 'dotenv/config'
import express, { Router } from 'express';
import { buildPriceChangeSpot } from './api/pyth';
import cors from 'cors';
import authMiddleware from './middlewares/auth';

let users = require('./routes/users') as Router;
let pyth = require('./routes/pyth') as Router;
let platforms = require('./routes/platforms') as Router;
let lppairs = require('./routes/lppairs') as Router;
let lpassets = require('./routes/lpassets') as Router;
let lppairaprs = require('./routes/lppairaprs') as Router;
let tokens = require('./routes/tokens') as Router;
let authRouter = require('./routes/auth') as Router;

buildPriceChangeSpot("devnet");


const app = express();

app.use(express.json());

const allowedOrigins = ['http://localhost:3000'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};
app.use(cors(options))

const pathsToIgnore = [/\/auth(\/.*)?/, new RegExp("\/users/[^\/]*") ];

var applyMiddlewareByPathFilter = function(middleware, paths:RegExp[]){
    return (req, res, next) => {
        if(paths.some((pathRegex) => (req._parsedUrl.pathname as string).match(pathRegex))) {
            next();
        } else {
            middleware(req, res, next);
        }
    };
};

app.use(applyMiddlewareByPathFilter(authMiddleware.verifyToken, pathsToIgnore));
app.use(applyMiddlewareByPathFilter(authMiddleware.validateUser, pathsToIgnore));
app.use('/auth', authRouter);
app.use('/platforms', platforms);
app.use('/lppairs', lppairs);
app.use('/lpassets', lpassets);
app.use('/lppairaprs', lppairaprs);
app.use('/users', users);
app.use('/tokens', tokens);
app.use('/price', pyth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`rf-engine start on port ${port}.`);
});
