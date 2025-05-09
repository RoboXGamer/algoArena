import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class TokenAndHashGenerator {
  signToken(payload, secret, options) {
    return jwt.sign(payload,secret,options);
  }

  verifyToken(token, secret, ) {
    return jwt.verify(token,secret);
  }

  async signHash(data) {
    const salt = bcrypt.genSaltSync(12);
    return await bcrypt.hash(data,salt);
  }

  async verifyHash(data, hashData) {
    return await bcrypt.compare(data,hashData);
  }
}

export const tokenAndHashGenerator = new TokenAndHashGenerator();