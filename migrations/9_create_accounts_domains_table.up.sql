BEGIN;
	CREATE TABLE account.accounts_domains (
		id uuid NOT NULL DEFAULT uuid_generate_v4(),
		"account_id" uuid,
    "domain_id" uuid,
		CONSTRAINT account_accounts_domains_pk PRIMARY KEY (id)
	);
COMMIT;
