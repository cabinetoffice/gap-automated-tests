export const selectSpotlightSession = `SELECT * FROM public.spotlight_session where scheme_id = $1;`;

export const getSchemeIdFromName = `SELECT * FROM public.grant_scheme where scheme_name = $1 and scheme_contact = $2`;

export const getGrantScheme = `SELECT * FROM public.grant_scheme`;

export const getExportedSubmission = `
SELECT * FROM public.grant_export WHERE submission_id IN (
    SELECT id FROM public.grant_submission WHERE applicant_id IN ($1, $2, $3) OR scheme_id IN (
        SELECT grant_scheme_id from public.grant_scheme WHERE created_by IN (
            SELECT grant_admin_id from public.grant_admin WHERE grant_admin_id IN ($4, $5) OR user_id IN (
                SELECT gap_user_id FROM gap_user WHERE user_sub IN ($6, $7, $8)
            )
        )
    )
);
`;

export const selectAllApiKeys = `SELECT * FROM public.api_key;`;

export const selectApiKeysByFunderId = `SELECT * FROM public.api_key WHERE funder_id = $1;`;
