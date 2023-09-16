import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {Animal} from '../../interfaces/Animal';
import AnimalModel from '../models/animalModel';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import {validationResult} from 'express-validator';

const animalListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const animals = await AnimalModel.find().select('-__v');
    if (!animals || animals.length === 0) {
      next(new CustomError('No animals found', 404));
      return;
    }
    res.json(animals);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const animalGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }
    const animal = await AnimalModel.findById(req.params.id).select('-__v');
    if (!animal) {
      next(new CustomError('Animal not found', 404));
      return;
    }
    res.json(animal);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const animalPost = async (
  req: Request<{}, {}, Animal>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }

    const animal = await AnimalModel.create(req.body);
    const message: DBMessageResponse = {
      message: 'Animal created',
      data: animal,
    };
    res.status(201).json(message);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const animalPut = async (
  req: Request<{id: string}, {}, Animal>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }

    const animal = await AnimalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    if (!animal) {
      next(new CustomError('Animal not found', 404));
      return;
    }
    const message: DBMessageResponse = {
      message: 'Animal updated',
      data: animal,
    };
    res.json(message);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const animalDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }

    const animal = await AnimalModel.findByIdAndDelete(req.params.id);
    if (!animal) {
      next(new CustomError('Animal not found', 404));
      return;
    }

    const message: DBMessageResponse = {
      message: 'Animal deleted',
      data: animal,
    };
    res.json(message);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

export {animalListGet, animalGet, animalPost, animalPut, animalDelete};
