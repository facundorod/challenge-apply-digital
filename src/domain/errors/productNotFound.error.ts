import { HttpException } from '@nestjs/common';

export class ProductNotFound extends HttpException {
  constructor() {
    super({ message: 'The product does not exist' }, 404);
  }
}
