import jwt from 'jsonwebtoken';
import { __jwtSecret__, __prod__ } from '../config/constants.js';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, __jwtSecret__, {
    expiresIn: __prod__ ? '1d' : '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: __prod__,
    sameSite: 'strict',
    maxAge: __prod__ ? 1 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
