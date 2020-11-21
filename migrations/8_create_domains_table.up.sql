BEGIN;
	CREATE TABLE account.domains (
		id uuid NOT NULL DEFAULT uuid_generate_v4(),
		"name" varchar(255) NOT NULL,
		"created_at" TIMESTAMP WITH TIME ZONE NOT null,
		"updated_at" TIMESTAMP WITH TIME ZONE NOT null,
		CONSTRAINT account_domains_pk PRIMARY KEY (id),
		CONSTRAINT account_domains_un_name UNIQUE (name)
	);
COMMIT;
