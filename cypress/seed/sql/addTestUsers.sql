insert into public.departments(id, ggis_id, name)
VALUES
('-1', 'GGIS_ID', 'Cypress - Test Department');

INSERT INTO public.gap_users(
	gap_user_id, email, sub, dept_id, login_journey_state)
	VALUES 
	('-1', 'findagrantdeveloper+super_admin@cabinetoffice.gov.uk', 'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE', '-1', 'USER_READY'),
	('-2', 'findagrantdeveloper+admin@cabinetoffice.gov.uk', 'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY', '-1', 'USER_READY'),
	('-3', 'findagrantdeveloper+applicant@cabinetoffice.gov.uk', 'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY', null, 'USER_READY');


INSERT INTO public.roles_users(
	roles_id, users_gap_user_id)
	VALUES 
	(1, '-1'),
	(2, '-1'),
	(3, '-1'),
	(4, '-1'),
	(1, '-2'),
	(2, '-2'),
	(3, '-2'),
	(1, '-3'),
	(2, '-3');