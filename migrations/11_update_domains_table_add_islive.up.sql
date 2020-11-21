BEGIN;
  ALTER TABLE account.domains ADD is_live bool NOT NULL DEFAULT false;
COMMIT;
