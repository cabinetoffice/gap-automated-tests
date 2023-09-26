DELETE FROM public.gap_users
	WHERE gap_user_id IN ('-1', '-2', '-3', '-4', '-5');

DELETE FROM public.departments
    WHERE id in ('-1');
