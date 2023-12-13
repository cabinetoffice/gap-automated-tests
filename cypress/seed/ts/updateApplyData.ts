const updateSpotlightSubmissionStatus: string = `
    UPDATE public.spotlight_submission
    SET status = $1, last_send_attempt = NOW()
    WHERE grant_scheme = $2 AND id IN ($3, $4);
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
