import { __prod__ } from '../config/constants.js';

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusdCode = res.statusdCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  res.status(statusdCode).json({
    message,
    stack: __prod__ ? '☃️' : err.stack,
  });
};

export { notFound, errorHandler };
