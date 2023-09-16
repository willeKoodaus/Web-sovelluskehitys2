import {NextFunction, Request, Response} from 'express';
import imageFromWikipedia from './functions/imageFromWikipedia';
import ErrorResponse from './interfaces/ErrorResponse';
import CustomError from './classes/CustomError';
import jwt from 'jsonwebtoken';
import {TokenUser, UserLogin} from './interfaces/User';
import userModel from './api/models/userModel';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // console.log('errorhanler', err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const getWikiImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {species_name} = req.body;
    const image = await imageFromWikipedia(species_name);
    req.body.image = image;
    next();
  } catch (error) {
    next(error);
  }
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers.authorization;
    if (!bearer) {
      next(new CustomError('Unauthorized', 401));
      return;
    }

    const token = bearer.split(' ')[1];

    if (!token) {
      next(new CustomError('Unauthorized', 401));
      return;
    }

    const userFromToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenUser;

    const user = (await userModel
      .findById(userFromToken.id)
      .select('-password, -role')) as UserLogin;

    if (!user) {
      next(new CustomError('Unauthorized', 401));
      return;
    }

    res.locals.user = user;
    res.locals.role = userFromToken.role;

    next();
  } catch (error) {
    next(new CustomError('Unauthorized', 401));
  }
};

export {notFound, errorHandler, getWikiImage, authenticate};
