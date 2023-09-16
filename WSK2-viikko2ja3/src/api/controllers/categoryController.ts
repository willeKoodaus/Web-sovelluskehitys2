// TODO: Controller for the Category model
// 1. Create function to get all categories
// 2. Create function to get a category by id
// 3. Create function to create a category
// 4. Create function to update a category
// 5. Create function to delete a category

import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {Category} from '../../interfaces/Category';
import CategoryModel from '../models/categoryModel';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import {validationResult} from 'express-validator';
import {UserLogin} from '../../interfaces/User';

const categoryListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await CategoryModel.find().select('-__v');
    if (!categories || categories.length === 0) {
      next(new CustomError('No categories found', 404));
      return;
    }
    res.json(categories);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const categoryGet = async (
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

    const category = await CategoryModel.findById(req.params.id).select('-__v');
    if (!category) {
      next(new CustomError('Category not found', 404));
      return;
    }
    res.json(category);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const categoryPost = async (
  req: Request<{}, {}, Category>,
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

    const category = await CategoryModel.create(req.body);
    const output: DBMessageResponse = {
      message: 'Category created',
      data: category,
    };
    res.status(201).json(output);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const categoryPut = async (
  req: Request<{id: string}, {}, Category>,
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

    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    ).select('-__v');
    if (!category) {
      next(new CustomError('Category not found', 404));
      return;
    }
    const output: DBMessageResponse = {
      message: 'Category updated',
      data: category,
    };
    res.json(output);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const categoryDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<{}, {user: UserLogin; role: string}>,
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

    /*
    if (res.locals.role !== 'admin') {
      next(new CustomError('Unauthorized', 401));
      return;
    }
    */

    const category = await CategoryModel.findByIdAndDelete(
      req.params.id
    ).select('-__v');
    if (!category) {
      next(new CustomError('Category not found', 404));
      return;
    }
    const output: DBMessageResponse = {
      message: 'Category deleted',
      data: category,
    };
    res.json(output);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

export {
  categoryListGet,
  categoryGet,
  categoryPost,
  categoryPut,
  categoryDelete,
};
