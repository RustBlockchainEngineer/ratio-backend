import express from 'express';
import { getUserByPublicKey, updateUserNonce } from '../api/users'
import jwt from 'jsonwebtoken'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { Auth } from '../models/model'
const { TextEncoder } = require("util");

let router = express.Router();

const { TOKEN_KEY } = process.env || "Missing Token key";


function generateToken(data: Auth) {
  return jwt.sign({ data: data }, TOKEN_KEY as string, { expiresIn: '24h' })
}

router.post('/', async function (req, res) {
  try {
    const { signature, publicAddress } = req.body;
    if (!signature || !publicAddress) {
      return res.status(400).send({ error: 'Request should have signature and publicAddress' })
    }

    // Step 1: Get the user with the given publicAddress
    const user: any = await getUserByPublicKey(publicAddress);

    if (!user) {
      return res.status(404).send({
        error: `User with publicAddress ${publicAddress} is not found in database`
      })
    }

    // Step 2: Verify digital signature
    const nonce = user.nonce.toString();
    const msgString = `Sign this message for authenticating with your wallet. Nonce: ${nonce}.`;
    const messageBytes = new TextEncoder().encode(msgString);

    const publicKeyBytes = bs58.decode(publicAddress);
    const signatureBytes: Uint8Array = bs58.decode(signature);

    const result = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    if (!result) {
      console.log(`authentication failed`);
      return res.status(400).send({
        error: 'Signature verification failed'
      })
    }

    // Step 3: Generate a new nonce for the user
    await updateUserNonce(publicAddress);

    // Step 4: Create JWT
    const data = {
      name: 'Auth',
      publicAddress,
      challenge: msgString,
      signature,
      nonce
    };
    const token = generateToken(data);
    console.log("User authenticated");
    return res.status(200).json({ token })
  } catch (err) {
    return res.status(400).send({ err })
  }
});

module.exports = router
