#!/usr/bin/env node
import { RequestOptions } from 'http';
import * as http from 'http';
import { Config } from '../config';
import { HTTPResponse } from '../interfaces/HttpResponseInterface';
import * as https from 'https';

interface IHealthResult {
  healthy: boolean;
  date: number;
}

type HealthResult = HTTPResponse<IHealthResult>;

/**
 * @author Jens Hummel
 * @version 1.0.0
 * @since 1.3.0 07.10.2022
 */
class DockerHealthcheck {
  constructor(runTests = true) {
    new Config();
    const options = {
      port: Config.getConfig().get('port'),
      httpsEnabled: Config.getConfig().get('ssl'),
    };

    if (runTests) this.runCheckUp(options);
  }

  private static log(...message: unknown[]) {
    console.log(new Date(), ...message);
  }

  /** Run Check and pass to Exit Code
   * @author Jens Hummel
   * @version 1.0.0
   * @since 1.3.0 07.10.2022
   */
  public runCheckUp(options: { port: number; httpsEnabled: boolean }) {
    DockerHealthcheck.log('Starting CheckUp...');
    this.executeCheckRequest(options).then(DockerHealthcheck.exitCode);
  }

  /** Execute API Call and check tests:
   * Request healthy API Status
   * @author Nico Wagner, Jens Hummel
   * @version 1.0.0
   * @since 1.3.0 07.10.2022
   */

  public executeCheckRequest(options: { port: number; httpsEnabled: boolean }) {
    return this.makeHTTPRequest(
      {
        host: 'localhost',
        port: options.port,
        path: '/health',
        agent: new https.Agent({ rejectUnauthorized: false }),
      },
      options.httpsEnabled
    )
      .then((res) => {
        DockerHealthcheck.log('Got HTTP response: ', res);
        const json: HealthResult = JSON.parse(res);
        return 'data' in json && json.data.healthy;
      })
      .catch(() => {
        return false;
      });
  }

  /**
   * Exits the process if parameter is true
   * @param {boolean} HealthSuccess True: if error occurred and health check failed
   * @private
   * @author Nico Wagner
   * @version 1.0.0
   * @since 1.3.0 07.10.2022
   */
  private static exitCode(HealthSuccess: boolean) {
    if (HealthSuccess) {
      DockerHealthcheck.log('Application seems healthy...');
      process.exit(0);
    }
    DockerHealthcheck.log('Error on healthCheck: NOT HEALTHY... exiting.');
    process.exit(1);
  }

  /**
   * Function for easy http request
   * @param options HTTP Parameter for request
   * @param useSsl Use SSL for request
   * @return Promise
   * @private
   * @author Nico Wagner
   * @version 1.0.0
   * @since 1.3.0 07.10.2022
   */
  private makeHTTPRequest(
    options: RequestOptions,
    useSsl = false
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      (useSsl ? https : http)
        .request(options, (res) => {
          if (res.statusCode !== 200) return reject();
          let data = '';

          res.on('data', (d) => {
            data += d;
          });
          res.once('end', () => {
            resolve(data);
          });
        })
        .end();
    });
  }
}

new DockerHealthcheck();
