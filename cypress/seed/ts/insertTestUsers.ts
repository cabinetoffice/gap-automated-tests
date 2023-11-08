const insertDepartments: string = `
INSERT INTO public.departments(id, ggis_id, name)
    VALUES('-1', 'GGIS_ID', 'Cypress - Test Department');
`;

const insertUsers: string = `
INSERT INTO public.gap_users(gap_user_id, email, sub, dept_id, login_journey_state)
	VALUES 
	('-1', $1, $2, '-1', 'USER_READY'),
	('-2', $3, $4, '-1', 'USER_READY'),
	('-3', $5, $6, null, 'USER_READY');
`;

const insertRoles: string = `
INSERT INTO public.roles_users(roles_id, users_gap_user_id)
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
`;

export { insertDepartments, insertUsers, insertRoles };
