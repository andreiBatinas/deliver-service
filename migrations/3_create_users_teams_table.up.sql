BEGIN;
	CREATE TABLE account.users_teams (
		id uuid NOT NULL DEFAULT uuid_generate_v4(),
		"user_id" uuid,
    "team_id" uuid,
    "is_default" boolean,
		CONSTRAINT account_users_teams_pk PRIMARY KEY (id)
	);
COMMIT;
