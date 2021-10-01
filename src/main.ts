import * as pkg from '../package.json';
import { Config } from './config/Config';
import { Application } from './infrastructure/http';
import { Logger } from './infrastructure/logger';
import { ConnectDatabase } from './infrastructure/typeorm';

async function main() {
  const log = new Logger(pkg.name);

  // tslint:disable-next-line: no-unused-expression
  const cfg = new Config('config.json', log);
  await cfg.load();


  await ConnectDatabase(log);

  const app = new Application(log);
  await app.start();
}

void main();
