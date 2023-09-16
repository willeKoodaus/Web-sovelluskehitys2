import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {Species, SpeciesInput} from '../../interfaces/Species';
import SpeciesModel from '../models/speciesModel';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import {validationResult} from 'express-validator';
import imageFromWikipedia from '../../functions/imageFromWikipedia';

const speciesListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const species = await SpeciesModel.find().select('-__v');
    if (!species || species.length === 0) {
      next(new CustomError('No species found', 404));
      return;
    }
    res.json(species);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const speciesGet = async (
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
    const species = await SpeciesModel.findById(req.params.id).select('-__v');
    if (!species) {
      next(new CustomError('Species not found', 404));
      return;
    }
    res.json(species);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const speciesPost = async (
  req: Request<{}, {}, Species>,
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
    const image = await imageFromWikipedia(req.body.species_name);
    const speciesWithImage: SpeciesInput = {
      ...req.body,
      image,
    };

    const species = new SpeciesModel(speciesWithImage);
    const result = await species.save();
    const response: DBMessageResponse = {
      message: 'Species added',
      data: result,
    };
    res.status(201).json(response);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const speciesPut = async (
  req: Request<{id: string}, {}, Species>,
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

    const species = await SpeciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    if (!species) {
      next(new CustomError('Species not found', 404));
      return;
    }
    const response: DBMessageResponse = {
      message: 'Species updated',
      data: species,
    };
    res.json(response);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const speciesDelete = async (
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

    const species = await SpeciesModel.findByIdAndDelete(req.params.id);
    if (!species) {
      next(new CustomError('Species not found', 404));
      return;
    }
    const response: DBMessageResponse = {
      message: 'Species deleted',
      data: species,
    };
    res.json(response);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

export {speciesListGet, speciesGet, speciesPost, speciesPut, speciesDelete};
