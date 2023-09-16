import {Schema, model} from 'mongoose';
import {User} from '../../interfaces/User';

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    minlength: 2,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
  },
});

export default model<User>('User', userSchema);
