BEGIN;
	ALTER TABLE account.roles DROP COLUMN "level";
COMMIT;
