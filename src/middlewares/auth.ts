import express from 'express'
import jwt from 'jsonwebtoken'
import { getUserByPublicKey } from '../api/users'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

const config = process.env;

export const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      error: "A token is required for authentication"
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    console.log("decoded", decoded);
    res.locals.jwt = decoded;
  } catch (err) {
    console.log("Invalid token. Error: ", err);
    return res.status(401).send({
      error: "Invalid Token"
    });
  }
  return next();
};

export const validateUser = async (
  req: express.Request,
  res: express.Response,
  next: (err?: Error) => void
) => {
  console.log("Access validateUser");
  const jwtPayload = res.locals.jwt.data
  console.log("jwtPayload", jwtPayload);
  const publicAddress = jwtPayload.publicAddress
  const challenge = jwtPayload.challenge
  const signature = jwtPayload.signature

  if (!publicAddress || !challenge || !signature) {
    return res.status(400).send({
      error: `Some parameters of the payload are empty`
    })
  }

  const user: any = await getUserByPublicKey(publicAddress);
  if (!user) {
    return res.status(400).send({
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

  return next()
}

export default {validateUser, verifyToken};