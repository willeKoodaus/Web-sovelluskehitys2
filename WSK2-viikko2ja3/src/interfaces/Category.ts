import {Document} from 'mongoose';

interface Category extends Document {
  category_name: string;
}

export {Category};
