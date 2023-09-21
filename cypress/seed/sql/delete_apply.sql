

delete from public.gap_user where gap_user_id <in ('-1', '-2', '-3', '-4', '-5');


delete from public.grant_funding_organisation where funder_id = '-1';

delete from public.grant_admin where grant_admin_id in ('-1', '-2');

delete from grant_applicant where id in ('-1', '-2', '-3')

delete from grant_scheme where grant_scheme_id in ('-1');

delete from grant_advert where grant_advert_id in ('-1');

