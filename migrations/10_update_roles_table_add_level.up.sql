BEGIN;
	ALTER TABLE account.roles ADD "level" integer NOT NULL DEFAULT 0;

	UPDATE account.roles SET level=1000 WHERE name='superAdmin';
	UPDATE account.roles SET level=100 WHERE name='accountOwner';
	UPDATE account.roles SET level=90 WHERE name='accountAdmin';
	UPDATE account.roles SET level=50 WHERE name='teamMember';
	UPDATE account.roles SET level=1 WHERE name='publicUser';
COMMIT;
