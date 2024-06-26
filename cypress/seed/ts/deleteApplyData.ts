const deleteAdverts: string = `
DELETE FROM public.grant_advert WHERE created_by IN (
    SELECT grant_admin_id FROM public.grant_admin WHERE grant_admin_id IN ($1, $2) OR user_id IN (
        SELECT gap_user_id FROM gap_user WHERE user_sub IN ($3, $4, $5, $6)
    )
);
`;

const deleteSubmissions: string = `
DELETE FROM public.grant_submission WHERE applicant_id IN ($1, $2, $3) OR scheme_id IN (
    SELECT grant_scheme_id from public.grant_scheme WHERE created_by IN (
        SELECT grant_admin_id from public.grant_admin WHERE grant_admin_id IN ($4, $5) OR user_id IN (
            SELECT gap_user_id FROM gap_user WHERE user_sub IN ($6, $7, $8, $9)
        )
    )
);
`;

const deleteApplications: string = `
DELETE FROM public.grant_application WHERE created_by IN (
    SELECT grant_admin_id from public.grant_admin WHERE grant_admin_id IN ($1, $2) OR user_id IN (
        SELECT gap_user_id FROM gap_user WHERE user_sub IN ($3, $4, $5, $6)
    )
);
`;
const deleteSchemes: string = `
DELETE FROM public.grant_scheme WHERE created_by IN (
    SELECT grant_admin_id from public.grant_admin WHERE grant_admin_id IN ($1, $2) OR user_id IN (
        SELECT gap_user_id FROM gap_user WHERE user_sub IN ($3, $4, $5, $6)
    )
);
`;

const deleteEditors: string = `DELETE FROM public.scheme_editors WHERE grant_admin_id IN ($1, $2);`;

const deleteAdmins: string = `
DELETE FROM public.grant_admin WHERE grant_admin_id IN ($1, $2, $3) OR user_id IN (
    SELECT gap_user_id FROM gap_user WHERE user_sub IN ($4, $5, $6, $7)
);
`;

const deleteTechSupportUser: string = `DELETE FROM public.tech_support_user WHERE user_sub IN ($1, $2, $3, $4)`;

const deleteApplicants: string = `
DELETE FROM public.grant_applicant WHERE
    id IN ($1, $2, $3) OR
    user_id IN ($4, $5, $6, $7);
`;

const deleteUsers: string = `
DELETE FROM public.gap_user WHERE
    gap_user_id IN ($1, $2, $3) OR
    user_sub IN ($4, $5, $6, $7);
`;

const deleteFundingOrgs: string = `
DELETE FROM public.grant_funding_organisation WHERE funder_id = $1;
`;

const deleteApplicantOrgProfiles: string = `
DELETE FROM public.grant_applicant_organisation_profile WHERE applicant_id IN ($1, $2, $3);
`;

const deleteFailedSpotlightOauthAudit = `
DELETE FROM public.spotlight_oauth_audit WHERE user_id = $1;
`;

const deleteSpotlightBatchRow = `
    DELETE FROM public.spotlight_batch WHERE id = $1;`;

const deleteSpotlightSubmissionRow: string = `
    DELETE FROM public.spotlight_submission
    WHERE grant_scheme = $1;
`;
const deleteExportBatch = `DELETE FROM grant_export_batch WHERE created_by IN ($1, $2, $3);`;

const deleteExport = `DELETE FROM grant_export WHERE created_by IN ($1, $2, $3);`;

const deleteApiKeys = `DELETE FROM public.api_key WHERE funder_id IN ($1, $2, $3);`;

const deleteApiKeysByFunderId = `DELETE FROM public.api_key
WHERE funder_id IN ($1, $2, $3);`;

const deleteApiKeysFundingOrganisations = `DELETE FROM public.grant_funding_organisation WHERE funder_id IN ($1, $2)`;

export {
  deleteAdmins,
  deleteAdverts,
  deleteApiKeys,
  deleteApiKeysByFunderId,
  deleteApiKeysFundingOrganisations,
  deleteApplicantOrgProfiles,
  deleteApplicants,
  deleteApplications,
  deleteFailedSpotlightOauthAudit,
  deleteFundingOrgs,
  deleteSchemes,
  deleteSpotlightBatchRow,
  deleteSpotlightSubmissionRow,
  deleteSubmissions,
  deleteTechSupportUser,
  deleteUsers,
  deleteExportBatch,
  deleteExport,
  deleteEditors,
};
