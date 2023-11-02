DELETE FROM public.unsubscribe WHERE "userId" in (
	SELECT id FROM public.gap_user WHERE sub in (
		'urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY'
    )
);

--delete newsletter

--delete subscription

--saved search notification (POSSIBLE MULTI-LEVEL CASCADE DELETE)
    --userid in saved search > delete from saved search notification > then delete from saved_search table


--keep this at the bottom
DELETE FROM public.gap_user
	WHERE sub in ('urn:fdc:gov.uk:2022:HvA7mHQsM_eNX5tAYNj2Oyj8_d3sooEtRjo7wbOaROY');


