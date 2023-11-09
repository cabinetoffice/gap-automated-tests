const insertDepartments: string = `
INSERT INTO public.departments(id, ggis_id, name)
    VALUES('-1', 'GGIS_ID', 'Cypress - Test Department');
`; // if not exists

const insertUsers: string = `
INSERT INTO public.gap_users(gap_user_id, email, sub, dept_id, login_journey_state)
	VALUES 
	($1, $2, $3, '-1', 'USER_READY'),
	($4, $5, $6, '-1', 'USER_READY'),
	($7, $8, $9, null, 'USER_READY');
`;

const insertRoles: string = `
INSERT INTO public.roles_users(roles_id, users_gap_user_id)
	VALUES 
	(1, $1),
	(2, $2),
	(3, $3),
	(4, $4),
	(1, $5),
	(2, $6),
	(3, $7),
	(1, $8),
	(2, $9);
`;

export { insertDepartments, insertUsers, insertRoles };
