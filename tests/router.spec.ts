import { createRouter } from '../src';
import * as express from 'express';
import { RouteList } from '../src/router/RouteInterface';
import { RouterController } from '../src';

describe('basic router', () => {
  let RouterSpy: jest.SpyInstance;
  let MockController: RouterController;

  beforeEach(() => {
    RouterSpy = jest.spyOn(express, 'Router');
    MockController = { initializeRoutes: jest.fn() };
  });

  it('should create Router object', () => {
    const routes: RouteList = [
      {
        path: '/',
        controller: MockController,
      },
    ];
    const router = createRouter({ routes });

    expect(router).toBeDefined();
    expect(RouterSpy).toBeCalledTimes(1);
  });

  it('should create Router with one route', () => {
    const routes: RouteList = [
      {
        path: '/',
        controller: MockController,
      },
    ];
    const router = createRouter({ routes });

    expect(router.stack.length).toBe(1);
  });

  it('should call Controller initializer', () => {
    const routes: RouteList = [
      {
        path: '/',
        controller: MockController,
      },
    ];
    createRouter({ routes });

    expect(MockController.initializeRoutes).toBeCalledTimes(1);
  });
});
