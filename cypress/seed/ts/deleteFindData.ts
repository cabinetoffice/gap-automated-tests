const deleteFromUnsubscribe: string = `
    DELETE FROM public.unsubscribe WHERE "userId" in (
        SELECT id FROM public.gap_user WHERE sub in (
            $1
      )
    );
`;

const deleteFromSubscription: string = `
    DELETE FROM public.subscription
        WHERE "userId" IN (
        SELECT id
        FROM public.gap_user
        WHERE sub IN ($1));
`;

const deleteFindUser: string = `
    DELETE FROM public.gap_user
        WHERE sub in ($1);
`;

export { deleteFromUnsubscribe, deleteFromSubscription, deleteFindUser };
