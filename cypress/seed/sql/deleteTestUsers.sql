DELETE FROM public.gap_users WHERE
    gap_user_id IN ('-1', '-2', '-3') OR
	sub in (
        'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
        'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
        'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
    ) OR
    email in (
        'findagrantdeveloper+super_admin@cabinetoffice.gov.uk',
        'findagrantdeveloper+admin@cabinetoffice.gov.uk',
        'findagrantdeveloper+applicant@cabinetoffice.gov.uk'
    );

DELETE FROM public.departments
    WHERE id in ('-1');
