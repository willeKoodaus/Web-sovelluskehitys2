import {Document, Types} from 'mongoose';

interface Animal extends Document {
  animal_name: string;
  species: Types.ObjectId;
  birthdate: Date;
  gender: 'Male' | 'Female';
}
export {Animal};
