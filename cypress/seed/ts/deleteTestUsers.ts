const deleteUsers: string = `
DELETE FROM public.gap_users WHERE
    gap_user_id IN ($1, $2, $3) OR
    sub in ($4, $5, $6) OR
    email in ($7, $8, $9);
`;

const deleteDepartments: string = `
DELETE FROM public.departments
    WHERE id in ($1);
`;

export { deleteUsers, deleteDepartments };
