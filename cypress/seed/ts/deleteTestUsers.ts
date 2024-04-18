const deleteUsers: string = `
DELETE FROM public.gap_users WHERE
    gap_user_id IN ($1, $2, $3, $4) OR
    sub in ($5, $6, $7, $8) OR
    email in ($9, $10, $11, $12);
`;

const deleteDepartments: string = `
DELETE FROM public.departments
    WHERE id in ($1, $2, $3) OR name in ($4);
`;

const deleteRole = `
DELETE FROM public.roles_users
    WHERE roles_id = $1 AND users_gap_user_id = $2;
`;

export { deleteUsers, deleteDepartments, deleteRole };
