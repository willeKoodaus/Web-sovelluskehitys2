// TODO: create the following functions:
// - userGet - get user by id
// - userListGet - get all users
// - userPost - create new user. Remember to hash password
// - userPutCurrent - update current user
// - userDeleteCurrent - delete current user
// - checkToken - check if current user token is valid: return data from req.user. No need for database query
import { Request, Response, NextFunction } from 'express';
import { User } from '../../interfaces/User';
import { UserOutput } from '../../interfaces/User';
import CustomError from '../../classes/CustomError';
import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';

const userGet = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.findById(req.params.id, {password: 0, role: 0});
        if (!user) {
        throw new CustomError('User not found', 404);
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const userListGet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.find({}, {password: 0, role: 0});
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const userPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = new userModel(req.body);
        //hash the password
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        
        const responseData: UserOutput = {
            _id: user._id,
            user_name: user.user_name,
            email: user.email,
        };
        
        res.status(200).json({
            message: 'User created successfully',
            data: responseData
        });
    } catch (error) {
        next(error);
    }
};

const userPutCurrent = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const user = await userModel.findById((req.user as User)._id);
    if (!user) {
    next(new CustomError('User not found', 404));
    return;
    }
    if (req.body.email) {
    user.email = req.body.email;
    }
    if (req.body.user_name) {
    user.user_name = req.body.user_name;
    }
    await user.save();
    res.json({message: 'user updated', data: {_id: user._id, user_name: user.user_name, email: user.email}});
} catch (error) {
    next(new CustomError('Database error', 500));
}
};

const userDeleteCurrent = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const result = await userModel.deleteOne({_id: (req.user as User)._id});
    if (result.deletedCount === 0) {
    next(new CustomError('User not found', 404));
    return;
    }
    const user= req.user as User;
    res.json({message: 'User deleted', data: {_id: user._id, user_name: user.user_name, email: user.email}});
} catch (error) {
    next(new CustomError('Database error', 500));
}
};

const checkToken = (req: Request, res: Response, next: NextFunction) => {
if (!req.user) {
    next(new CustomError('token not valid', 403));
} else {
    const user: UserOutput = req.user;
    res.json({_id: user._id, user_name: user.user_name, email: user.email});
}
};



export {userGet, userListGet, userPost, userPutCurrent, userDeleteCurrent, checkToken};