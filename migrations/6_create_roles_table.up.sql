BEGIN;
	CREATE TABLE account.roles (
		id uuid NOT NULL DEFAULT uuid_generate_v4(),
		"name" varchar(255) NOT NULL,
		CONSTRAINT account_roles_pk PRIMARY KEY (id)
	);

	INSERT INTO account.roles (id, name) VALUES(uuid_generate_v4(), 'superAdmin');
	INSERT INTO account.roles (id, name) VALUES(uuid_generate_v4(), 'accountOwner');
	INSERT INTO account.roles (id, name) VALUES(uuid_generate_v4(), 'accountAdmin');
  INSERT INTO account.roles (id, name) VALUES(uuid_generate_v4(), 'teamMember');
	INSERT INTO account.roles (id, name) VALUES(uuid_generate_v4(), 'publicUser');
COMMIT;

