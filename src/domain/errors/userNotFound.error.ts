import { HttpException } from '@nestjs/common';

export class UserNotFound extends HttpException {
  constructor() {
    super({ message: 'The user email does not exist' }, 404);
  }
}
