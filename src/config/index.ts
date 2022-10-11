import { Schema, Config as ConvictConfig } from 'convict';
import {
  defaultMainConfig,
  DefaultMainConfigInterface,
} from './defaultMainConfig';
import * as convict from 'convict';
import * as path from 'path';
import * as fs from 'fs';

export class Config<T extends object> {
  private _config: ConvictConfig<T & DefaultMainConfigInterface>;
  private static _instance:
    | Config<any & DefaultMainConfigInterface>
    | undefined;

  public static getConfig<T>(): ConvictConfig<T & DefaultMainConfigInterface> {
    if (!Config._instance)
      throw new ReferenceError(
        'Tried accessing Config instance without registering it first'
      );
    return Config._instance._config as ConvictConfig<
      T & DefaultMainConfigInterface
    >;
  }

  constructor(configObject?: Schema<T>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._config = convict({ ...defaultMainConfig, ...configObject });
    this.loadConfigFile();
    this._config.validate({ allowed: 'strict' });

    Config._instance = this;
  }

  private loadConfigFile(): void {
    const env = this._config.get('env');
    const configFile = path.join('.', env + '.json');
    if (fs.existsSync(configFile)) {
      this._config.loadFile(configFile);
    }
  }
}
