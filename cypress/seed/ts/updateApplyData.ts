const updateSpotlightSubmissionStatus: string = `
    UPDATE public.spotlight_submission
    SET status = 'GGIS_ERROR'
    WHERE grant_scheme = -21;
`;

export { updateSpotlightSubmissionStatus };
