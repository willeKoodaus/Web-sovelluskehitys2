import {RowDataPacket} from 'mysql2';
import { type } from 'os';
import { Interface } from 'readline';
interface User {
  user_id: number;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

// TODO: create interface or type GetUser that extends RowDataPacket and User
interface GetUser extends RowDataPacket, User {}
// TODO create interface or type PostUser that extends User but without id
type PostUser = Omit<User, 'user_id'>;
// TODO create interface or type PutUser that extends PostUser but all properties are optional
interface PutUser extends Partial<PostUser> {}

export {User, GetUser, PostUser, PutUser};
