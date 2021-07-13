/* eslint-disable @typescript-eslint/naming-convention */
import { Connection, createConnection, getConnection } from 'typeorm';
import { Configuration } from '../../config/Config';
import { Logger } from '../logger';
import { Account, Fleet } from './models';

// eslint-disable-next-line no-shadow
enum DatabaseError {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ConnectionError = 'Unable to connect to database',
}

let DB: Connection;

async function ConnectDatabase(log: Logger) {
  try {
    await createConnection({
      name: 'default',
      type: Configuration.db.driver,
      host: Configuration.db.host,
      port: Configuration.db.port,
      username: Configuration.db.username,
      password: Configuration.db.password,
      database: Configuration.db.database,
      logging: Configuration.db.logging,
      schema: 'public',
      entities: [Account, Fleet],
    });

    DB = getConnection();
  } catch (e) {
    log.error(`[Typeorm][ConnectDatabase] ${DatabaseError.ConnectionError}`, e);
    throw new Error(DatabaseError.ConnectionError);
  }
}

export { ConnectDatabase, DB };
