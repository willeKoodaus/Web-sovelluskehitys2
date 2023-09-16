import {Schema, model} from 'mongoose';
import {Species} from '../../interfaces/Species';
// Schema for the Species model
// based on the Species interface located at: src/interfaces/Species.ts

const speciesSchema = new Schema<Species>({
  species_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

export default model<Species>('Species', speciesSchema);
