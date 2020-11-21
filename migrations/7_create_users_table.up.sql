BEGIN;
	CREATE TABLE account.users (
		id uuid NOT NULL DEFAULT uuid_generate_v4(),
		"password" varchar(255) NOT NULL,
		"email" varchar(255) NOT NULL,
    "surname" varchar(255) NULL,
    "name" varchar(255) NOT NULL,
		"phone" varchar(65),
    "token" varchar(255),
    "status" varchar(255) NOT NULL,
    "status_reason" varchar(255),
		"created_at" TIMESTAMP WITH TIME ZONE NOT null,
		"updated_at" TIMESTAMP WITH TIME ZONE NOT null,
		CONSTRAINT account_users_pk PRIMARY KEY (id),
		CONSTRAINT account_users_un_email UNIQUE (email),
		CONSTRAINT account_users_un_phone UNIQUE (phone)
	);
COMMIT;
