import {Document} from 'mongoose';

interface User extends Document {
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

interface LoginUser extends User {
    _id: string;
}

type UserOutput = Partial<User>;

type UserTest = Partial<User>;

export {User, UserOutput, LoginUser, UserTest};