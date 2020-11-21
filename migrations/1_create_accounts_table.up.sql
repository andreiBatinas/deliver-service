-- account.accounts definition

-- Create accounts.accounts table
BEGIN;
	CREATE TABLE account.accounts (
		id uuid NOT NULL DEFAULT uuid_generate_v4(),
		"name" varchar(255) NOT NULL,
		"address_first_line" varchar(255),
		"address_second_line" varchar(255),
		"postal_code" varchar(255),
		"city" varchar(255),
		"country" varchar(255),
    "status" varchar(255),
		"status_reason" varchar(255),
		"created_at" TIMESTAMP WITH TIME ZONE NOT null,
		"updated_at" TIMESTAMP WITH TIME ZONE NOT null,
		CONSTRAINT account_accounts_pk PRIMARY KEY (id)
	);
COMMIT;

