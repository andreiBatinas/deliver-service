BEGIN;
	CREATE TABLE account.users_roles (
		id uuid NOT NULL DEFAULT uuid_generate_v4(),
		"user_id" uuid,
    "role_id" uuid,
		CONSTRAINT account_users_roles_pk PRIMARY KEY (id)
	);
COMMIT;
