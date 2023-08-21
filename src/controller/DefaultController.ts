import { IRoute, NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import { HttpExceptions, HTTPResponse } from '../index';
import InputException from '../exceptions/InputException';
import { RouterController } from '../router/RouterController';
import { IDefaultService } from '../service/IDefaultService';
import { RequestTypes } from '../router/RequestTypes';
import { ControllerContext } from './ControllerContext';

export class DefaultController<
  B,
  P extends Record<string, unknown>,
  S extends IDefaultService<B, any>,
  K extends keyof P
> implements RouterController
{
  private readonly bodySchema: Schema<B>;
  private readonly paramSchema: Schema<P>;
  protected readonly service: S;
  protected readonly primaryKey: K;
  constructor(obj: {
    bodySchema: Schema<B>;
    paramSchema: Schema<P>;
    service: S;
    primaryKey: K;
  }) {
    this.bodySchema = obj.bodySchema;
    this.paramSchema = obj.paramSchema;
    this.service = obj.service;
    this.primaryKey = obj.primaryKey;
  }

  /*
   * Attach the routes to the router
   * @param route The route to attach the controller to
   */
  public initializeRoutes(route: IRoute) {
    route
      .get(
        this._requestHandler(this.get.bind(this), RequestTypes.GET).bind(this)
      )
      .post(
        this._requestHandler(this.post.bind(this), RequestTypes.POST).bind(this)
      )
      .patch(
        this._requestHandler(this.patch.bind(this), RequestTypes.PATCH).bind(
          this
        )
      )
      .delete(
        this._requestHandler(this.delete.bind(this), RequestTypes.DELETE).bind(
          this
        )
      )
      .put(
        this._requestHandler(this.put.bind(this), RequestTypes.PUT).bind(this)
      );
  }

  protected _bodyValidation(type: string, obj: object) {
    const result = this.bodySchema.tailor(type).validate(obj);
    if (result.error) throw new InputException(result.error.details);
    return result;
  }

  /*
   * Validate the params of a request
   * @param type The type of request
   * @param obj The object to validate
   */
  protected _paramValidation(type: RequestTypes, obj: object) {
    const result = this.paramSchema.tailor(type).validate(obj);
    if (result.error) throw new InputException(result.error.details);
    return result;
  }

  protected _requestHandler(
    fn: (
      data: { params: P },
      req: Request,
      res: Response
    ) => Promise<HTTPResponse<never>>,
    type: RequestTypes
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { value: params } = this._paramValidation(type, req.params);
        const data = await fn({ params }, req, res);
        res.json(data);
      } catch (e) {
        next(e);
      }
    };
  }

  protected getPrimaryId(params: P): P[K] {
    return params[this.primaryKey];
  }

  protected async get({
    params,
  }: ControllerContext<P>): Promise<HTTPResponse<B | B[] | null>> {
    const x = this.getPrimaryId(params)
      ? await this.service.get(this.getPrimaryId(params))
      : await this.service.list();
    return { data: x };
  }

  protected async delete({
    params,
  }: ControllerContext<P>): Promise<HTTPResponse<number>> {
    const x = await this.service.delete(this.getPrimaryId(params));
    return { data: x };
  }

  protected async post(
    _context: ControllerContext<P>,
    req: Request
  ): Promise<HTTPResponse<B>> {
    const validationResult = this._bodyValidation('create', req.body);
    const x = await this.service.create(validationResult.value);
    return { data: x };
  }

  protected async patch(
    { params }: ControllerContext<P>,
    req: Request
  ): Promise<HTTPResponse<B>> {
    const validationResult = this._bodyValidation('update', req.body);
    const x = await this.service.update(
      this.getPrimaryId(params),
      validationResult.value
    );
    if (!x)
      throw new HttpExceptions.NotFound(
        `'${this.getPrimaryId(params)}' not found while trying to update` //todo fix .id in thing here
      );
    return { data: x };
  }

  protected async put(
    { params }: ControllerContext<P>,
    req: Request
  ): Promise<HTTPResponse<B>> {
    const validationResult = this._bodyValidation('create', req.body); //if validation error throw also exception
    const x = await this.service.create(
      validationResult.value,
      this.getPrimaryId(params)
    );
    return { data: x };
  }
}

export default DefaultController;
