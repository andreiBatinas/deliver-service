-- account.teams definition
-- THIS IS READONLY TABLE POPULATED BY KAKFA
-- topic:

-- Create accounts.teams table
BEGIN;
	CREATE TABLE account.teams (
		id uuid NOT NULL DEFAULT uuid_generate_v4(),
		"account_id" uuid,
		"domain_id" uuid,
		"name" varchar(255) NOT NULL,
		"created_at" TIMESTAMP WITH TIME ZONE NOT null,
		"updated_at" TIMESTAMP WITH TIME ZONE NOT null,
		CONSTRAINT account_teams_pk PRIMARY KEY (id)
	);
COMMIT;
