import ioredis from 'ioredis';

import { Configuration } from '../../config/Config';
import { Logger } from '../logger';
import { RedisStore } from './RedisStore';

const log = new Logger('Redis');
// tslint:disable-next-line: variable-name
let Redis: RedisStore;

enum RedisError {
  ConnectionError = 'Unable to connect to redis'
}

// tslint:disable-next-line: function-name
async function RedisConnect() {
  try {
    const r = new ioredis(Configuration.redisConfig);
    Redis = new RedisStore(r, log);
  } catch (e) {
    log.error(`[RedisConnect] ${RedisError.ConnectionError}`, e);
    throw new Error(RedisError.ConnectionError);
  }
}

export { Redis, RedisConnect };
