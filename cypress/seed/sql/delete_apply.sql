

delete from public.gap_user where gap_user_id < 0;


delete from public.grant_funding_organisation

INSERT INTO public.grant_funding_organisation(funder_id, organisation_name)
	VALUES ('-1', 'Cypress - Test Funding Organisation');


-- insert grant_admin
INSERT INTO public.grant_admin(grant_admin_id, funder_id, user_id)
	VALUES ('-1', '-1', '-3'),
    ('-2', '-1', '-5');

-- grant_applicant

INSERT INTO public.grant_applicant(id, user_id)
	VALUES ('-1', '-1'),
    ('-2', '-2'),
    ('-3', '-4');



INSERT INTO public.grant_scheme(
	grant_scheme_id, funder_id, version, ggis_identifier, created_date, last_updated, last_updated_by, scheme_name, scheme_contact, created_by)
	VALUES ('-1', '-1', 1, 'GGIS_ID_1', NOW(), null, null, 'Cypress - Test Scheme', 'test_contact"gmail.com', '-5');


    -- INSERT INTO public.grant_application(
	-- grant_application_id, grant_scheme_id, version, created, last_update_by, last_updated, application_name, status, definition, created_by, last_published)
	-- VALUES ('-1', '-1', 1, now(), null, null, ?, ?, ?, ?, ?);

INSERT INTO public.grant_advert(
grant_advert_id, contentful_entry_id, contentful_slug, created, grant_advert_name, last_updated, response, status, version, created_by, last_updated_by, scheme_id, opening_date, closing_date, first_published_date, last_published_date, unpublished_date)
VALUES 
    (
        '-1', 'contentful_id', 'contentful_slug', now(), 'Cypress - Automated E2E Test Grant', now(), 
        '{"sections":[{"pages":[{"questions":[{"id":"grantShortDescription","seen":true,"response":"yes","multiResponse":null}],"id":"1","status":"COMPLETED"},{"questions":[{"id":"grantLocation","seen":true,"response":null,"multiResponse":["National"]}],"id":"2","status":"IN_PROGRESS"},{"questions":[{"id":"grantFunder","seen":true,"response":"test","multiResponse":null}],"id":"3","status":"COMPLETED"},{"questions":[{"id":"grantApplicantType","seen":true,"response":null,"multiResponse":["Public Sector"]}],"id":"4","status":"IN_PROGRESS"}],"id":"grantDetails","status":"IN_PROGRESS"},{"pages":[{"questions":[{"id":"grantTotalAwardAmount","seen":true,"response":"2","multiResponse":null},{"id":"grantMaximumAward","seen":true,"response":"2","multiResponse":null},{"id":"grantMinimumAward","seen":true,"response":"1","multiResponse":null}],"id":"1","status":"COMPLETED"}],"id":"awardAmounts","status":"COMPLETED"},{"pages":[{"questions":[{"id":"grantApplicationOpenDate","seen":true,"response":null,"multiResponse":["01","01","2021","00","01"]},{"id":"grantApplicationCloseDate","seen":true,"response":null,"multiResponse":["01","01","2022","23","59"]}],"id":"1","status":"IN_PROGRESS"}],"id":"applicationDates","status":"IN_PROGRESS"},{"pages":[{"questions":[{"id":"grantEligibilityTab","seen":true,"response":null,"multiResponse":["<p>yes</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"yes\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"1","status":"IN_PROGRESS"},{"questions":[{"id":"grantSummaryTab","seen":true,"response":null,"multiResponse":["<p>yes</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"yes\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"2","status":"COMPLETED"},{"questions":[{"id":"grantDatesTab","seen":true,"response":null,"multiResponse":["<p>yes</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"yes\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"3","status":"IN_PROGRESS"},{"questions":[{"id":"grantApplyTab","seen":true,"response":null,"multiResponse":["<p>yes</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"yes\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"5","status":"IN_PROGRESS"}],"id":"furtherInformation","status":"IN_PROGRESS"}]}',
        'PUBLISHED', 1, '-5', '-5', '-1', now(), now() + interval '3 days', now() - interval '3 days', now() - interval '2 days', null
    );


 --INSERT INTO grant_advert (grant_advert_id, contentful_entry_id, contentful_slug, created, grant_advert_name, last_updated, response, status, version, created_by, last_updated_by, scheme_id, opening_date, closing_date, first_published_date, last_published_date, unpublished_date) 
 --VALUES
 -- ('ce87733c-d165-4af2-a910-4021253597ef', 'bf3fba05-9bc3-444b-9880-0684f81653aa', 'voluptate-accusamus-magnam', '2023-09-20T18:45:27.209Z', 'BauchHagenesandOsinski',  '2023-09-20T21:21:47.021Z',
 --  '{"sections":[{"pages":[{"questions":[{"id":"grantShortDescription","seen":true,"response":"This is a grant advert test","multiResponse":null}],"id":"1","status":"COMPLETED"},{"questions":[{"id":"grantLocation","seen":true,"response":null,"multiResponse":["National"]}],"id":"2","status":"COMPLETED"},{"questions":[{"id":"grantFunder","seen":true,"response":"The Cabinet Office","multiResponse":null}],"id":"3","status":"COMPLETED"},{"questions":[{"id":"grantApplicantType","seen":true,"response":null,"multiResponse":["Personal / Individual"]}],"id":"4","status":"COMPLETED"}],"id":"grantDetails","status":"COMPLETED"},{"pages":[{"questions":[{"id":"grantTotalAwardAmount","seen":true,"response":"1000","multiResponse":null},{"id":"grantMaximumAward","seen":true,"response":"100","multiResponse":null},{"id":"grantMinimumAward","seen":true,"response":"10","multiResponse":null}],"id":"1","status":"COMPLETED"}],"id":"awardAmounts","status":"COMPLETED"},{"pages":[{"questions":[{"id":"grantApplicationOpenDate","seen":true,"response":null,"multiResponse":["1","1","2099","00","01"]},{"id":"grantApplicationCloseDate","seen":true,"response":null,"multiResponse":["2","1","2099","23","59"]}],"id":"1","status":"COMPLETED"}],"id":"applicationDates","status":"COMPLETED"},{"pages":[{"questions":[{"id":"grantWebpageUrl","seen":true,"response":"https://A-TEST-LINK.com","multiResponse":null}],"id":"1","status":"COMPLETED"}],"id":"howToApply","status":"COMPLETED"},{"pages":[{"questions":[{"id":"grantEligibilityTab","seen":true,"response":null,"multiResponse":["<p>eligibility test info</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"eligibility test info\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"1","status":"COMPLETED"},{"questions":[{"id":"grantSummaryTab","seen":true,"response":null,"multiResponse":["<p>a long test description</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"a long test description\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"2","status":"COMPLETED"},{"questions":[{"id":"grantDatesTab","seen":true,"response":null,"multiResponse":["<p>this is details about dates</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"this is details about dates\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"3","status":"COMPLETED"},{"questions":[{"id":"grantObjectivesTab","seen":true,"response":null,"multiResponse":["<p>this is details about objectives</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"this is details about objectives\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"4","status":"COMPLETED"},{"questions":[{"id":"grantApplyTab","seen":true,"response":null,"multiResponse":["<p>this is information on how to apply</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"this is information on how to apply\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"5","status":"COMPLETED"},{"questions":[{"id":"grantSupportingInfoTab","seen":true,"response":null,"multiResponse":["<p>this is supporting information</p>","{\"nodeType\":\"document\",\"data\":{},\"content\":[{\"nodeType\":\"paragraph\",\"content\":[{\"nodeType\":\"text\",\"value\":\"this is supporting information\",\"marks\":[],\"data\":{}}],\"data\":{}}]}"]}],"id":"6","status":"COMPLETED"}],"id":"furtherInformation","status":"COMPLETED"}]}',
 --'PUBLISHED', 1, '-5', '-5', '-1', '2023-09-20T21:28:40.640Z', '2024-02-25T23:23:22.928Z', '2023-09-20T18:42:39.911Z', '2023-09-20T16:39:06.951Z', '2024-07-09T17:01:50.231Z');