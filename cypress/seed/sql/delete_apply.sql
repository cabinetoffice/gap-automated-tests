delete from public.grant_advert where grant_advert_id in ('00000000-0000-0000-0000-000000000000') or created_by in ('-2');

delete from public.grant_submission where application_id in ('-1');

delete from public.grant_application where grant_application_id in ('-1') or created_by in ('-2');

delete from public.grant_scheme where grant_scheme_id in ('-1') or created_by in ('-2');

delete from public.grant_admin where grant_admin_id in ('-1', '-2');

delete from public.grant_applicant where
    id in ('-1', '-2', '-3') OR
    user_id in (
        'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
        'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
        'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
    );

delete from public.gap_user where
    gap_user_id in ('-1', '-2', '-3') OR
    user_sub in (
        'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
        'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
        'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
    );

delete from public.grant_funding_organisation where funder_id = '-1';

delete from public.grant_applicant_organisation_profile where applicant_id in ('-1', '-2', '-3');