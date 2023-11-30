export const selectSpotlightSession = `SELECT * FROM public.spotlight_session where scheme_id = $1;`;
export const getSchemeIdFromName = `SELECT * FROM public.grant_scheme where scheme_name = $1 and scheme_contact = $2`;
