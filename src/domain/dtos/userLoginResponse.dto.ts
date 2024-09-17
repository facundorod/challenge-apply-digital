import { User } from '../models/user.model';

export class UserLoginResponse {
  user: Omit<User, 'password'>;
  userToken: string;
  expirationDate: Date;

  constructor(
    user: Omit<User, 'password'>,
    userToken: string,
    expirationDate: Date,
  ) {
    this.user = user;
    this.userToken = userToken;
    this.expirationDate = expirationDate;
  }
}
