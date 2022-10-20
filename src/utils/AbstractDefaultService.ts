import { IDefaultService } from '../interfaces/IDefaultService';
import NotImplemented from '../exceptions/NotImplemented';

abstract class DefaultService<T, I> implements IDefaultService<T, I> {
  create(_obj: T, _id: I | undefined): Promise<T> {
    throw new NotImplemented();
  }

  delete(_id: I): Promise<number> {
    throw new NotImplemented();
  }

  get(_id: I): Promise<T | null> {
    throw new NotImplemented();
  }

  list(): Promise<T[]> {
    throw new NotImplemented();
  }

  update(_id: I, _obj: T): Promise<T | null> {
    throw new NotImplemented();
  }
}

export default DefaultService;
