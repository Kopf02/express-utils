import HttpException from './HttpException';

class NotImplemented extends HttpException {
  constructor() {
    super(501, 'Not Implemented');
  }
}

export default NotImplemented;
