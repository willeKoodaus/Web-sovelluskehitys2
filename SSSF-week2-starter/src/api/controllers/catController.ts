// TODO: create following functions taking note from userController.ts:
// - catGetByUser - get all cats by current user id
// - catGetByBoundingBox - get all cats by bounding box coordinates (getJSON)
// - catPutAdmin - only admin can change cat owner
// - catDeleteAdmin - only admin can delete cat
// - catDelete - only owner can delete cat
// - catPut - only owner can update cat
// - catGet - get cat by id
// - catListGet - get all cats
// - catPost - create new cat
import { Request, Response, NextFunction, Locals } from 'express';
import { User } from '../../interfaces/User';
import { UserOutput } from '../../interfaces/User';
import CustomError from '../../classes/CustomError';
import userModel from '../models/userModel';
import catModel from '../models/catModel';
import { Cat } from '../../interfaces/Cat';
import MessageResponse from '../../interfaces/MessageResponse';
import rectangleBounds from '../../utils/rectangleBounds';

const catGetByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cats = await catModel.find({owner: (req.user as User)});
        res.status(200).json(cats);
    } catch (error) {
        next(error);
    }
};

const catGetByBoundingBox = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Parse the topRight and bottomLeft from the query parameters
        const topRight = {
            lat: parseFloat((req.query.topRight as string).split(',')[0]),  // Latitude first
            lng: parseFloat((req.query.topRight as string).split(',')[1])   //Longitude second
        };
        const bottomLeft = {
            lat: parseFloat((req.query.bottomLeft as string).split(',')[0]),  // Latitude first
            lng: parseFloat((req.query.bottomLeft as string).split(',')[1])   //Longitude second
        };
        console.log(topRight, bottomLeft);
        // Create a Polygon using the utility function
        const polygonCoordinates = rectangleBounds(topRight, bottomLeft);
        console.log(polygonCoordinates);
        const cats = await catModel.find({
            location: {
                $geoWithin: {
                    $geometry: polygonCoordinates,
                },
            },
        });
        console.log(cats);
        res.status(200).json(cats);
    } catch (error) {
        next(error);
    }
};



const catPutAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cat = await catModel.findById(req.params.id).populate('owner', {password: 0, role: 0});
        if (!cat) {
            next(new CustomError('Cat not found', 404));
            return;
        }
        if (req.body.owner) {
            cat.owner = req.body.owner;
        }
        if (req.body.cat_name) {
            cat.cat_name = req.body.cat_name;
        }
        if (req.body.weight) {
            cat.weight = req.body.weight;
        }
        if (req.body.filename) {
            cat.filename = req.body.filename;
        }
        if (req.body.birthdate) {
            cat.birthdate = req.body.birthdate;
        }
        if (req.body.location) {
            cat.location = req.body.location;
        }
        await cat.save();
        res.status(200).json({message: 'cat updated', data: cat});
    } catch (error) {
        next(error);
    }
};

const catDeleteAdmin = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const cat = await catModel.findByIdAndDelete(req.params.id);
        if (!cat) {
            next(new CustomError('Cat not found', 404));
            return;
        }
        const message: MessageResponse = {
            message: 'Cat deleted',
          };
          res.json({message, data: cat});
    } catch (error) {
        next(error);
    }
};

const catDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cat = await catModel.findById(req.params.id);
        if (!cat) {
            next(new CustomError('Cat not found', 404));
            return;
        }
        if ((req.user as User)._id !== cat.owner.toString()) {
            next(new CustomError('Unauthorized', 401));
            return;
        }
        await cat.deleteOne();
        const message: MessageResponse = {
            message: 'Cat deleted',
          };
          res.json({message, data: cat});
        res.status(200).json(cat);
    } catch (error) {
        next(error);
    }
};

const catPut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cat = await catModel.findById(req.params.id);
        if (!cat) {
            next(new CustomError('Cat not found', 404));
            return;
        }
        if ((req.user as User)._id !== cat.owner.toString()) {
            next(new CustomError('Unauthorized', 401));
            return;
        }
        if (req.body.cat_name) {
            cat.cat_name = req.body.cat_name;
        }
        if (req.body.weight) {
            cat.weight = req.body.weight;
        }
        if (req.body.filename) {
            cat.filename = req.body.filename;
        }
        if (req.body.birthdate) {
            cat.birthdate = req.body.birthdate;
        }
        if (req.body.location) {
            cat.location = req.body.location;
        }
        await cat.save();
        res.status(200).json({message: 'cat updated', data: cat});
    } catch (error) {
        next(error);
    }
};

const catGet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.params);
        const cat = await catModel.findById(req.params.id).populate('owner', {password: 0, role: 0});
        if (!cat) {
            throw new CustomError('Cat not found', 404);
        }
        res.status(200).json(cat);
    } catch (error) {
        next(error);
    }
};

const catListGet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cats = await catModel.find().populate('owner', {password: 0, role: 0});
        res.status(200).json(cats);
    } catch (error) {
        next(error);
    }
};

const catPost = async (
    req: Request<{}, {}, Cat>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {cat_name, birthdate, weight} = req.body;
  
      if (!req.file) {
        return res.status(400).json({error: 'No file uploaded'});
      }
  
      const filename = req.file.filename;
  
      const cat = await catModel.create({
        cat_name: cat_name,
        weight: weight,
        filename: filename,
        birthdate: birthdate,
        location: res.locals.coords,
        owner: (req.user as User)._id,
      });
  
      const message: MessageResponse = {
        message: 'Cat added',
      };
      res.json({message, data: cat});
    } catch (error) {
      next(error);
    }
  };

export {catPutAdmin, catDeleteAdmin, catDelete, catPut, catGet, catListGet, catPost, catGetByUser, catGetByBoundingBox};