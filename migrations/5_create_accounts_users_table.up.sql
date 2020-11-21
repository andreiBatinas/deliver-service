BEGIN;
	CREATE TABLE account.accounts_users (
		id uuid NOT NULL DEFAULT uuid_generate_v4(),
		"account_id" uuid,
    "user_id" uuid,
		CONSTRAINT account_accounts_users_pk PRIMARY KEY (id)
	);
COMMIT;
