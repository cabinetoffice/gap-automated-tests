const deleteAdverts: string = `
DELETE FROM public.grant_advert WHERE grant_advert_id IN ('00000000-0000-0000-0000-000000000000') OR created_by IN (
    SELECT grant_admin_id FROM public.grant_admin WHERE grant_admin_id IN ('-1', '-2') OR user_id IN (
        SELECT gap_user_id FROM gap_user WHERE user_sub IN (
            'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
            'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
            'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
        )
    )
);
`;

const deleteSubmissions: string = `
DELETE FROM public.grant_submission WHERE application_id IN ('-1') OR scheme_id IN (
    SELECT grant_scheme_id from public.grant_scheme WHERE grant_scheme_id IN ('-1') OR created_by IN (
        SELECT grant_admin_id from public.grant_admin WHERE grant_admin_id IN ('-1', '-2') OR user_id IN (
            SELECT gap_user_id FROM gap_user WHERE user_sub IN (
                'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
                'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
                'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
            )
        )
    )
);
`;

const deleteApplications: string = `
DELETE FROM public.grant_application WHERE grant_application_id IN ('-1') OR created_by IN (
    SELECT grant_admin_id from public.grant_admin WHERE grant_admin_id IN ('-1', '-2') OR user_id IN (
        SELECT gap_user_id FROM gap_user WHERE user_sub IN (
            'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
            'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
            'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
        )
    )
);
`;

const deleteSchemes: string = `
DELETE FROM public.grant_scheme WHERE grant_scheme_id IN ('-1') OR created_by IN (
    SELECT grant_admin_id from public.grant_admin WHERE grant_admin_id IN ('-1', '-2') OR user_id IN (
        SELECT gap_user_id FROM gap_user WHERE user_sub IN (
            'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
            'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
            'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
        )
    )
);
`;

const deleteAdmins: string = `
DELETE FROM public.grant_admin WHERE grant_admin_id IN ('-1', '-2') OR user_id IN (
    SELECT gap_user_id FROM gap_user WHERE user_sub IN (
        'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
        'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
        'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
    )
);
`;

const deleteApplicants: string = `
DELETE FROM public.grant_applicant WHERE
    id IN ('-1', '-2', '-3') OR
    user_id IN (
        'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
        'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
        'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
    );
`;

const deleteUsers: string = `
DELETE FROM public.gap_user WHERE
    gap_user_id IN ('-1', '-2', '-3') OR
    user_sub IN (
        'urn:fdc:gov.uk:2022:fWal-gUz2TTpPZrp9-PgbW5jOk10hXfTy3cgxxW5HRE',
        'urn:fdc:gov.uk:2022:1QUViebEw1PHGV7iShahw7hmaSG9OL4RFzY_WgR2qcY',
        'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
    );
`;

const deleteFundingOrgs: string = `
DELETE FROM public.grant_funding_organisation WHERE funder_id = '-1';
`;

const deleteApplicantOrgProfiles: string = `
DELETE FROM public.grant_applicant_organisation_profile WHERE applicant_id IN ('-1', '-2', '-3');
`;

export {
  deleteAdverts,
  deleteSubmissions,
  deleteApplications,
  deleteSchemes,
  deleteAdmins,
  deleteApplicants,
  deleteUsers,
  deleteFundingOrgs,
  deleteApplicantOrgProfiles,
};
