enum DatabaseDriver {
  MySQL = 'mysql',
  MariaDB = 'mariadb',
  Postgres = 'postgres',
  MsSQL = 'mssql'
}

export interface AppConfiguration {
  env: string;
  http: {
    port: number;
  };
  db: {
    driver: DatabaseDriver;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    logging: boolean;
  };
  firebase: {
    credential: string;
    databaseURL: string;
  };
  redisConfig: {
    port: number;
    host: string;
    keyPrefix: string;
  };
  apiUrl: {
    whisbiGatewayApi: string;
  };
  redisKeys: {
    redisExpiry: number;
    redisKeysPrefix: {
      token: string;
      team: string;
    };
  };
  firebaseApi: {
    returnRejectedPromiseOnError: boolean;
    withCredentials: boolean;
    timeout: number;
    headers: {
      common: Record<string, string>;
    };
  };
  WhisbiApi: {
    returnRejectedPromiseOnError: boolean;
    withCredentials: boolean;
    timeout: number;
    headers: {
      common: Record<string, string>;
    };
  };
}
