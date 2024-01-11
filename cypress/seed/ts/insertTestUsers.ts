import { DEPARTMENT_NAME } from "../apply/constants";

const insertDepartments: string = `
INSERT INTO public.departments(id, ggis_id, name)
    VALUES
	($1, 'GGIS_ID', '${DEPARTMENT_NAME}'),
	($2, 'GGIS_ID_EDIT', '${DEPARTMENT_NAME} Edit'),
	($3, 'GGIS_ID_DELETE', '${DEPARTMENT_NAME} Delete');
`;

const insertUsers: string = `
INSERT INTO public.gap_users(gap_user_id, email, sub, dept_id, login_journey_state)
	VALUES 
	($1, $2, $3, $4, 'USER_READY'),
	($5, $6, $7, $8, 'USER_READY'),
	($9, $10, $11, null, 'USER_READY');
	($12, $13, $14, $15, 'USER_READY'),
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
	(1, $10);
	(2, $11)
	(5, $12);
	
`;

export { insertDepartments, insertUsers, insertRoles };
