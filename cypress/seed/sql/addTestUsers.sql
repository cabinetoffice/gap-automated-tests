insert into public.departments(id, ggis_id, name)
VALUES
('-1', 'GGIS_ID', 'Cypress - Test Department');

INSERT INTO public.gap_users(
	gap_user_id, email, sub, dept_id, login_journey_state)
	VALUES 
	('-1', 'test-user-applicant-1@gov.uk', 'urn:fdc:gov.uk:2022:ibd2rz2CgyidndXyq2zyfcnQwyYI57h34vMlSr77BBb', null, 'PRIVACY_POLICY_PENDING'),
	('-2', 'test-user-applicant-2@gov.uk', 'urn:fdc:gov.uk:2022:ibd2rz2CgyidndXyq2zyfcnQwyYI57h34vMlSr88CCc', null, 'PRIVACY_POLICY_PENDING'),
	('-3', 'test.super-admin@gov.uk', 'urn:fdc:gov.uk:2022:ibd2rz2CgyidndXyq2zyfcnQwyYI57h34vMlSr97YUg', '-1', 'USER_READY'),
	('-4', 'conor.fayle+cypress_applicant@and.digital', 'urn:fdc:gov.uk:2022:9ANsYHeQjQ0_5MnpParV5KsRzDUXN6MBPvSrS1ImsOk', null, 'USER_READY'),
	('-5', 'conor.fayle+cypress_admin@and.digital', 'urn:fdc:gov.uk:2022:LecF494FeMdjRWanGBLEtr1UVDc7wLCk1CsAh0F_k08', '-1', 'USER_READY');


INSERT INTO public.roles_users(
	roles_id, users_gap_user_id)
	VALUES 
	(1, '-3'),
	(2, '-3'),
	(3, '-3'),
	(4, '-3'),
	(1, '-5'),
	(2, '-5'),
	(3, '-5'),
	(1, '-4'),
	(2, '-4');