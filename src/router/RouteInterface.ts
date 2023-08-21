import { RouterController } from './RouterController';

export interface OptionalRouteInterface {
  path: string;
  controller?: RouterController;
  children?: RouteList;
}

export type RouteInterface = (
  | Required<Pick<OptionalRouteInterface, 'children'>>
  | Required<Pick<OptionalRouteInterface, 'controller'>>
) &
  OptionalRouteInterface;

export type RouteList = [RouteInterface, ...RouteInterface[]];
