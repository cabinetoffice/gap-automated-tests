const insertFindUser: string = `
    INSERT INTO public.gap_user(
    id, hashed_email_address, encrypted_email_address, "createdAt", "updatedAt", sub)
    VALUES (
        ($1),
        '16hCClOl21DJEqt+sLzD4+R+LSpEYELjzkoGjYd/mmkRJONotFXE6vWUWrLE9pYnESz3kNPOSsPxehBAkbg4bg==',
        'AgV4RQqlTJ2tiVN3gOwtzhhp2MWrIxP2EM4K54pTLogMRxcAqAAEABVhd3MtY3J5cHRvLXB1YmxpYy1rZXkAREFuVXF3UCsrZVM3eFJKTU5qZjh1YTRXOFdmYTFKUGZHN0s2S3c1MTRtbzJlWlVTZlJlU2VESWJvc0ZwaDJyNUthZz09AAZvcmlnaW4ACWV1LXdlc3QtMgAHcHVycG9zZQAfR292LlVLIEdyYW50IEFwcGxpY2F0aW9uIEZpbmRlcgAFc3RhZ2UAA2RldgABAEthcm46YXdzOmttczpldS13ZXN0LTI6ODAxMzQ3MzY0Nzg0OmtleS8yYzhkNjE1ZC0wODI0LTRkNWItOTk5Yi03NDc1ZWQwYmVjYjkAODJjOGQ2MTVkLTA4MjQtNGQ1Yi05OTliLTc0NzVlZDBiZWNiOQAAAIAAAAAMuz8sLs3gH0yuEPQcADAotSnXq/mDACiC13EkSbh8iKB3Li5jWt9lfCNcxJ6eTrYxSkypDGn3uhmZRGKTCCcCAAAQAC8O1aBEXGNrhJpJ8gkcI85k6JAgcGkaMNdhflx/UlGFr/+pfFAzVlI6lmV7xQlRN/////8AAAABAAAAAAAAAAAAAAABAAAAMiBGbto8MCylAYKjqu9lMk7DHpw9KEJrD58yn4zOgQpEj9pWNSLozNUfGqDxMGCMPg2yK3jopzXPObyR62PGz3bYAQBmMGQCMHVsbzpWwhRN7mJy6S4rvwUQGgGZuegudlJuRt8tiOAIGH/fHfty5Cei7QLqpLBqmQIwWOrmPvJ3dNLXDT0UcLU8nE13ki19Q+GLDYJAGeAZ1D5yrDIUhU3OCTkQBVG6cPtA',
        NOW(),
        NOW(),
        ($2)
    );
`;

export { insertFindUser };
