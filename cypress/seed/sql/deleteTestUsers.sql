DELETE FROM public.gap_users
	WHERE gap_user_id IN ('-1', '-2', '-3');

DELETE FROM public.departments
    WHERE id in ('-1');
