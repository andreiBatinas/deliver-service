import { MigrationInterface, QueryRunner } from 'typeorm';

export class accountMigr1625680751114 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE accounts (
        id SERIAL PRIMARY KEY,
        name VARCHAR ( 50 ) UNIQUE NOT NULL,
        password VARCHAR ( 50 ) NOT NULL,
        email VARCHAR ( 255 ) UNIQUE NOT NULL,
        cui varchar(30) UNIQUE NOT NULL,
        "officeAddress" VARCHAR ( 50 ) NOT NULL,
        telephone integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
            "updatedAt" TIMESTAMP
    );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts'); // reverts things made in "up" method
  }
}
