const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

let cfg;
cfg = fs.readFileSync('config.json');

let cfgObj = JSON.parse(cfg);

module.exports = {
  type: cfgObj.db.driver,
  host: process.env.MSSQL_HOST,
  port: process.env.MSSQL_PORT,
  username: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  database: process.env.MSSQL_DATABASE,
  logging: true,
  entities: ['src/infrastructure/typeorm/models/**/*.ts'],
  migrations: ['src/infrastructure/typeorm/migrations/**/*.ts'],
  subscribers: ['src/infrastructure/typeorm/subscribers/**/*.ts'],
  cli: {
    migrationsDir: 'src/infrastructure/typeorm/migrations'
  }
};
