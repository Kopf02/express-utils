import { NextFunction, Request, Response, Router } from 'express';
import { IDefaultService } from '../interfaces/IDefaultService';
import { ObjectSchema } from 'joi';
import { IDefaultController } from '../interfaces/IDefaultController';
import { HttpExceptions, HTTPResponse } from '../index';
import InputException from '../exceptions/InputException';

abstract class AbstractDefaultController<T, I, S extends IDefaultService<T, I>>
  implements IDefaultController
{
  private readonly joiSchema: ObjectSchema;
  protected readonly service: S;
  private readonly _router: Router | undefined;
  constructor(obj: { joi: ObjectSchema; service: S; router?: Router }) {
    this.joiSchema = obj.joi;
    this.service = obj.service;
    this._router = obj.router;
  }

  public initializeRoutes() {
    if (this._router)
      this._router
        .route('/:id?')
        .get(this.get)
        .post(this.post)
        .patch(this.patch)
        .delete(this.delete)
        .put(this.put);
  }

  protected _missingID = (req: Request) => {
    if (!req.params.id) throw new HttpExceptions.BadRequest('Missing ID');
  };

  abstract parseId(id: string): I;

  protected _getId(req: Request): I {
    return this.parseId(req.params.id);
  }

  protected _joiValidation(type: string, obj: object) {
    const result = this.joiSchema.tailor(type).validate(obj);
    if (result.error) throw new InputException(result.error.details);
    return result;
  }

  protected get = async (
    req: Request,
    res: Response<HTTPResponse<T | T[] | null>>,
    next: NextFunction
  ) => {
    try {
      const x = req.params.id
        ? await this.service.get(this._getId(req))
        : await this.service.list();
      res.json({ data: x });
    } catch (e) {
      next(e);
    }
  };

  protected delete = async (
    req: Request,
    res: Response<HTTPResponse<number>>,
    next: NextFunction
  ) => {
    try {
      this._missingID(req);
      const x = await this.service.delete(this._getId(req));
      res.json({ data: x });
    } catch (e) {
      next(e);
    }
  };

  protected post = async (
    req: Request,
    res: Response<HTTPResponse<T>>,
    next: NextFunction
  ) => {
    try {
      const validationResult = this._joiValidation('create', req.body);
      const x = await this.service.create(validationResult.value);
      res.json({ data: x });
    } catch (e) {
      next(e);
    }
  };

  protected patch = async (
    req: Request,
    res: Response<HTTPResponse<T>>,
    next: NextFunction
  ) => {
    try {
      this._missingID(req);
      const validationResult = this._joiValidation('update', req.body);
      const x = await this.service.update(
        this._getId(req),
        validationResult.value
      );
      if (!x)
        throw new HttpExceptions.NotFound(
          `'${req.params.id}' not found while trying to update`
        );
      res.json({ data: x });
    } catch (e) {
      next(e);
    }
  };

  protected put = async (
    req: Request,
    res: Response<HTTPResponse<T>>,
    next: NextFunction
  ) => {
    try {
      this._missingID(req); //if id is missing, throw input exception or so
      const validationResult = this._joiValidation('create', req.body); //if validation error throw also exception
      const x = await this.service.create(
        validationResult.value,
        this._getId(req)
      );
      res.json({ data: x });
    } catch (e) {
      next(e); //catch all errors from above and pass to error middleware
    }
  };
}

export default AbstractDefaultController;
