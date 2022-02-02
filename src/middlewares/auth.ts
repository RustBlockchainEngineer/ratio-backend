import * as express from 'express'
import jwt from 'jsonwebtoken'
import { getUserByPublicKey } from '../api/users'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { UserRole } from '../models/model'
import { Request, Response, NextFunction } from 'express';

const { TextEncoder } = require("util");

const { TOKEN_KEY } = process.env || "Missing Token key";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  //return next();// by pass verifyToken for now
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({
      error: "A token is required for authentication"
    });
  }
  try {

    const decoded = jwt.verify(token, TOKEN_KEY as jwt.Secret);
    res.locals.jwt = decoded;
  } catch (err) {
    return res.status(401).send({
      error: "Invalid Token"
    });
  }
  return next();
};

const validateUser = async (
  req: express.Request,
  res: express.Response,
  next: (err?: Error) => void
) => {
  //return next(); // by pass validateUser for now
  const { publicAddress, challenge, signature } = res.locals.jwt.data

  if (!publicAddress || !challenge || !signature) {
    return res.status(401).send({
      error: `Some parameters of the payload are empty`
    })
  }

  const user: any = await getUserByPublicKey(publicAddress);
  if (!user) {
    return res.status(401).send({
      error: `User with publicAddress ${publicAddress} is not found in database`
    })
  }
  const messageBytes = new TextEncoder().encode(challenge);

  const publicKeyBytes = bs58.decode(publicAddress);
  const signatureBytes = bs58.decode(signature);

  const result = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

  // The signature verification is successful if the address found with
  if (result === false) {
    return res.status(401).send({
      error: "Signature verification failed"
    });
  }
  res.locals.user = user;
  return next()
}

const authorize = (roles: UserRole[] = []) => {
  // roles param can be a single role string (e.g. Role.User or 'User') 
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authorize based on user role
    (req: Request, res: Response, next: NextFunction) => {

      if (roles.length && !roles.includes(res.locals.user.role)) {
        // user's role is not authorized
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // authentication and authorization successful
      next();
    }
  ];
}

export default { validateUser, verifyToken, authorize };