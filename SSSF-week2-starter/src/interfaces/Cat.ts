// TODO: cat interface
import {Document, Types} from 'mongoose';
import {UserOutput} from './User';
interface Cat extends Document{
  // TODO: create a cat interface
  // owner should be a User
  cat_name: string;
  weight: number;
  filename: string;
  birthdate: string;
  location: GeoJSON.Point;
  owner: Types.ObjectId | UserOutput;
}

export {Cat};