import jwt from 'jsonwebtoken';
import asyncHanlder from './asyncHandler.js';
import User from '../models/userModel.js';
import { __jwtSecret__ } from '../config/constants.js';

const protect = asyncHanlder(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const { userId } = jwt.verify(token, __jwtSecret__);
      req.user = await User.findById(userId).select('-password');
      next();
    } catch (err) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
};

export { protect, admin };
