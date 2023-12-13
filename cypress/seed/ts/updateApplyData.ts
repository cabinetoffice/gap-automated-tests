const updateSpotlightSubmissionStatus: string = `
    UPDATE public.spotlight_submission
    SET status = $1, last_send_attempt = NOW(),
    id = $2
    WHERE grant_scheme = $3;
`;

const removeQueuedSpotlightSubmissions: string = `
    UPDATE public.spotlight_batch
    SET last_send_attempt = '1980-01-01 11:11:11.47596'
    WHERE last_send_attempt IS NULL;
`;

const readdQueuedSpotlightSubmissions = `
    UPDATE public.spotlight_batch
    SET last_send_attempt = NULL
    WHERE last_send_attempt = '1980-01-01 11:11:11.47596';
`;

export {
  readdQueuedSpotlightSubmissions,
  removeQueuedSpotlightSubmissions,
  updateSpotlightSubmissionStatus,
};
