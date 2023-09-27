delete from public.grant_advert where grant_advert_id in ('00000000-0000-0000-0000-000000000000');

delete from public.grant_submission where application_id in ('-1');

delete from public.grant_application where grant_application_id in ('-1');

delete from public.grant_scheme where grant_scheme_id in ('-1');

delete from public.grant_admin where grant_admin_id in ('-1', '-2');

delete from public.grant_applicant where id in ('-3');

delete from public.gap_user where gap_user_id in ('-1', '-2', '-3');

delete from public.grant_funding_organisation where funder_id = '-1';

delete from public.grant_applicant_organisation_profile where applicant_id in ('-1', '-2', '-3');
