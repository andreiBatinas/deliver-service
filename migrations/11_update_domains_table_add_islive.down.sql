BEGIN;
	ALTER TABLE account.domains DROP COLUMN "is_live";
COMMIT;
