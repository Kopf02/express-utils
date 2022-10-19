import { NextFunction, Request, Response } from 'express';
import { HttpExceptions, logger } from '../index';

/**
 * This class is all about the maintenance mode
 * You can control if the mode is enabled or not and fetches its value
 * @author Nico
 * @version 1
 * @since 26.06.2021
 * @class
 */
abstract class MaintenanceMiddleware {
  private static _instance: MaintenanceMiddleware;

  static getInstance(): MaintenanceMiddleware {
    return this._instance;
  }

  /**
   * Variable to store the maintenance mode value to not fetch the value every request
   *
   * This may change in the future to prevent caching issues
   * @private
   * @author Nico Wagner
   * @version 1
   * @since 19.10.2022
   */
  private _isEnabled: boolean;

  /**
   * Variable to store the Timestamp for the last Update of the maintenance mode
   *
   * @private
   * @author Jens Hummel
   * @version 1
   * @since 19.10.2022
   */
  private lastCheck: Date;

  /**
   * Variable to store the Duration for how long the Maintenance Status should be cached before fetching again
   *
   * @private
   * @author Jens Hummel
   * @version 1
   * @since 19.10.2022
   */
  private _cacheDuration: number;

  /**
   * Fetches the initial value of the maintenance state for the API
   * @author Jens Hummel, Nico Wagner
   * @param {boolean}defaultState - Default State of Maintenance Mode
   * @param {boolean}cacheDuration - Duration how long the Cache should last
   * @version 1
   * @since 19.10.2022
   * @constructor
   */
  constructor(defaultState = false, cacheDuration: number = 1000 * 60 * 5) {
    MaintenanceMiddleware._instance = this;
    this._isEnabled = defaultState;
    this._cacheDuration = cacheDuration;
    this.getEnabledStatus()
      .then((value) => {
        this._isEnabled = value;
        this.lastCheck = new Date();
      })
      .catch(logger.error);
  }

  /**
   * Fetches the maintenance mode state of the DB & parses it to a boolean
   * @return Promise
   * @private
   * @version 1
   * @since 19.10.2022
   */
  protected abstract getEnabledStatus(): Promise<boolean>;

  /**
   * Writes the maintenance mode state to the DB
   * @return Promise
   * @private
   * @version 1
   * @since 19.10.2022
   */
  protected abstract setEnabledStatus(newState: boolean): Promise<void>;

  /**
   * Getter function for the isEnabled boolean
   * @author Nico Wagner
   * @return boolean - The maintenance mode state
   * @version 1
   * @since 19.10.2022
   */
  public get isEnabled(): boolean {
    return this._isEnabled;
  }

  /**
   * Set the maintenance mode
   * - Checks if maintenance mode is already active / not active
   * - Saves new value in DB
   * @param {boolean}newValue - The new State of the maintenance mode
   * @return Promise
   * @since 26.06.2021 02:24
   * Updated 05.10.2022 07:02
   */
  public setMaintenanceStatus(newValue: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getEnabledStatus()
        .then((value) => {
          if (value === newValue)
            reject(
              'Maintenance mode already ' + value ? 'enabled' : 'disabled'
            );
          else {
            this._isEnabled = value;
            this.setEnabledStatus(value).then(resolve, reject);
          }
        })
        .catch((err) => {
          logger.error(err);
          reject(err);
        });
    });
  }

  /**
   * Checks for the maintenance mode status
   *
   * If enabled, send error and end request, else, call next()
   * @param {Request}_req - Express Request
   * @param _res
   * @param {NextFunction}next - Express NextFunction
   * @author Jens Hummel, Nico Wagner
   * @version 2
   * @since 26.06.2021 03:02
   */
  public ExpressMiddleWare = (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    this.checkUpdate();

    logger.debug('Maintenance Middleware called.');

    if (this.isEnabled) {
      logger.debug('Request during maintenance!');
      return next(
        new HttpExceptions.HttpException(401, 'Maintenance mode enabled')
      );
    }

    next();
  };

  /**
   * Periodical check, if Maintenance Mode status changed
   *
   * @author Jens Hummel
   * @version 1
   * @since 26.06.2021 12:15
   */
  private checkUpdate() {
    const currentDate = new Date();

    if (
      this.lastCheck?.getMilliseconds() + this._cacheDuration <
      currentDate.getMilliseconds()
    ) {
      this.getEnabledStatus()
        .then((value) => {
          if (value !== null && value != this.isEnabled) {
            logger.info('Maintenance Mode ' + value ? 'enabled' : 'disabled');
            this._isEnabled = value;
            this.lastCheck = currentDate;
          }
        })
        .catch(logger.error);
    }
  }
}

export default MaintenanceMiddleware;
