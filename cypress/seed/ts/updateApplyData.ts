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

const readdQueuedSpotlightSubmissions: string = `
    UPDATE public.spotlight_batch
    SET last_send_attempt = NULL
    WHERE last_send_attempt = '1980-01-01 11:11:11.47596';
`;

const incrementApplicationFormVersion: string = `
  UPDATE public.grant_application
  SET version = version + 1
  WHERE grant_application_id = $1;
`;

export {
  readdQueuedSpotlightSubmissions,
  removeQueuedSpotlightSubmissions,
  updateSpotlightSubmissionStatus,
  incrementApplicationFormVersion,
};
