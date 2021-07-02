import { config } from 'dotenv';
import {
  pathExistsSync,
  readFile,
} from 'fs-extra';

import { Logger } from '../infrastructure/logger';
import { AppConfiguration } from './AppConfiguration';

export class Config {
  private filePath: string;
  private log: Logger;

  constructor(filePath: string, log: Logger) {
    config();
    this.filePath = filePath;
    this.log = log;
  }

  public async load() {
    if (false === pathExistsSync(this.filePath)) {
      this.filePath = 'config.default.json';
      this.log.warn(
        '[Config] config file not found, using config.default.json'
      );
    }

    try {
      const file = await readFile(this.filePath, 'utf-8');
      const rawConfigJson = JSON.parse(file);
      let stringConfigJson = JSON.stringify(rawConfigJson);
      for (const env in process.env) {
        stringConfigJson = stringConfigJson.replace(
          `"${env}"`,
          `"${process.env[env]}"`
        );
      }

      Configuration = JSON.parse(stringConfigJson) as AppConfiguration;
      this.log.info('Credentials:', Configuration);
    } catch (e) {
      this.log.error('[Config][getFile] Error loading config', e);
    }
  }
}

// tslint:disable-next-line: variable-name
export let Configuration: AppConfiguration;
