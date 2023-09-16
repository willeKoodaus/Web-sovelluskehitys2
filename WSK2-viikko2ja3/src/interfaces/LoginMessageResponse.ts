import {UserLogin} from './User';

interface LoginMessageResponse {
  message: string;
  user: UserLogin;
  token: string;
}

export {LoginMessageResponse};
