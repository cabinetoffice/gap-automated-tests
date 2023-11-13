const deleteFromUnsubscribe: string = `
    DELETE FROM public.unsubscribe WHERE "userId" in (
        SELECT id FROM public.gap_user WHERE sub in (
            'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
      )
    );
`;

const deleteFromSubscription: string = `
    DELETE FROM public.subscription
        WHERE "userId" IN (
        SELECT id
        FROM public.gap_user
        WHERE sub IN ('urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'));
`;

const deleteFindUser: string = `
    DELETE FROM public.gap_user
        WHERE sub in ('urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY');
`;

export { deleteFromUnsubscribe, deleteFromSubscription, deleteFindUser };
