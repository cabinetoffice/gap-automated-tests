const insertApplicants: string = `
INSERT INTO public.grant_applicant (id, user_id)
    VALUES
    ($1::bigint, $2),
    ($3::bigint, $4),
    ($5::bigint, $6);
`;

const insertUsers: string = `
INSERT INTO public.gap_user (gap_user_id, user_sub)
    VALUES
    ($1, $2),
    ($3, $4),
    ($5, $6);
`;

const insertFundingOrgs: string = `
INSERT INTO public.grant_funding_organisation(funder_id, organisation_name)
    VALUES ('-1', 'Cypress - Test Funding Organisation');
`; // if not exists

const insertAdmins: string = `
INSERT INTO public.grant_admin(grant_admin_id, funder_id, user_id)
    VALUES
    ($1, '-1', $2),
    ($3, '-1', $4);
`;

const insertGrantApplicantOrgProfiles: string = `
INSERT INTO public.grant_applicant_organisation_profile(id, address_line1, address_line2, charity_commission_number, companies_house_number, county, legal_name, postcode, town, type, applicant_id)
    VALUES
    ($1, null, null, null, null, null, null, null, null, null, $2),
    ($3, null, null, null, null, null, null, null, null, null, $4),
    ($5, null, null, null, null, null, null, null, null, null, $6);
`;

const insertSchemes: string = `
INSERT INTO public.grant_scheme(grant_scheme_id, funder_id, version, ggis_identifier, created_date, last_updated, last_updated_by, scheme_name, scheme_contact, created_by)
    VALUES ('-1', '-1', 1, 'GGIS_ID_1', NOW(), NOW(), '-2', 'Cypress - Test Scheme V1', $1, '-2');
`; // if not exists

const insertApplications: string = `
INSERT INTO public.grant_application (grant_application_id, grant_scheme_id, version, created, last_update_by, last_updated, application_name, status, definition, created_by, last_published)
    VALUES (
        '-1', '-1', 1,  NOW(), -2, NOW(), 'Cypress - Test Application V1', 'PUBLISHED',
        '{"sections":[{"sectionId":"ELIGIBILITY","sectionTitle":"Eligibility","sectionStatus":"COMPLETE","questions":[{"questionId":"ELIGIBILITY","fieldTitle":"Eligibility Statement","displayText":"eligibility","questionSuffix":"Does your organisation meet the eligibility criteria?","responseType":"YesNo","validation":{"mandatory":true}}]},{"sectionId":"ESSENTIAL","sectionTitle":"Required checks","sectionStatus":"COMPLETE","questions":[{"questionId":"APPLICANT_ORG_NAME","profileField":"ORG_NAME","fieldTitle":"Enter the name of your organisation","hintText":"This is the official name of your organisation. It could be the name that is registered with Companies House or the Charities Commission","adminSummary":"organisation legal name","responseType":"ShortAnswer","validation":{"mandatory":true,"minLength":2,"maxLength":250}},{"questionId":"APPLICANT_TYPE","profileField":"ORG_TYPE","fieldTitle":"Choose your organisation type","hintText":"Choose the option that best describes your organisation","adminSummary":"organisation type (e.g. limited company)","responseType":"Dropdown","validation":{"mandatory":true},"options":["Limited company","Non-limited company","Registered charity","Unregistered charity","Other"]},{"questionId":"APPLICANT_ORG_ADDRESS","profileField":"ORG_ADDRESS","fieldTitle":"Enter your organisation''s address","adminSummary":"registered address","responseType":"AddressInput","validation":{"mandatory":true}},{"questionId":"APPLICANT_ORG_CHARITY_NUMBER","profileField":"ORG_CHARITY_NUMBER","fieldTitle":"Enter your Charity Commission number (if you have one)","hintText":"Funding organisation might use this to identify your organisation when you apply for a grant. It might also be used to check your organisation is legitimate.","adminSummary":"Charity Commission number (if applicable)","responseType":"ShortAnswer","validation":{"mandatory":false,"minLength":2,"maxLength":15,"validInput":"alphanumeric-nospace"}},{"questionId":"APPLICANT_ORG_COMPANIES_HOUSE","profileField":"ORG_COMPANIES_HOUSE","fieldTitle":"Enter your Companies House number (if you have one)","hintText":"Funding organisation might use this to identify your organisation when you apply for a grant. It might also be used to check your organisation is legitimate.","adminSummary":"Companies House number (if applicable)","responseType":"ShortAnswer","validation":{"mandatory":false,"minLength":2,"maxLength":8,"validInput":"alphanumeric-nospace"}},{"questionId":"APPLICANT_AMOUNT","fieldPrefix":"£","fieldTitle":"How much does your organisation require as a grant?","hintText":"Please enter whole pounds only","adminSummary":"amount of funding required","responseType":"Numeric","validation":{"mandatory":true,"greaterThanZero":true}},{"questionId":"BENEFITIARY_LOCATION","fieldTitle":"Where will this funding be spent?","hintText":"Select the location where the grant funding will be spent. You can choose more than one, if it is being spent in more than one location.\\n\\nSelect all that apply:","adminSummary":"where the funding will be spent","responseType":"MultipleSelection","validation":{"mandatory":true},"options":["North East England","North West England","South East England","South West England","Midlands","Scotland","Wales","Northern Ireland"]}]},{"sectionId":"33b0559f-1cf5-4d22-b4a9-c35a300c876e","sectionTitle":"Custom Section","questions":[{"questionId":"c8890343-5722-42d9-845a-6226e4fde6c8","fieldTitle":"Custom Question 1","hintText":"Short description","responseType":"YesNo","validation":{"mandatory":true}},{"questionId":"8c4bf8f9-e175-4bd8-a54f-3d9587767bca","fieldTitle":"Custom Question 2","hintText":"Short description","responseType":"ShortAnswer","validation":{"mandatory":true,"maxLength":250,"minLength":1}},{"questionId":"d864dc12-d12c-411c-9e2f-8097fa8c5b90","fieldTitle":"Custom Question 3","hintText":"Short description","responseType":"LongAnswer","validation":{"mandatory":true,"maxLength":6000,"minLength":2}},{"questionId":"0f0f03e1-9636-4d0d-bd98-e72690307156","fieldTitle":"Custom Question 4","hintText":"Short description","responseType":"Dropdown","validation":{"mandatory":false},"options":["Choice 1","Choice 2"]},{"questionId":"9e9038d1-3911-4e60-9f15-3b2c319506ac","fieldTitle":"Custom Question 5","hintText":"Short description","responseType":"MultipleSelection","validation":{"mandatory":false},"options":["Choice 1","Choice 2"]},{"questionId":"178a34aa-2b23-46db-9831-421db766234c","fieldTitle":"Custom Question 6","hintText":"Short description","responseType":"SingleFileUpload","validation":{"mandatory":true,"maxFileSizeMB":300,"allowedTypes":["DOC","DOCX","ODT","PDF","XLS","XLSX","ZIP"]}},{"questionId":"e228a74a-290c-4b60-b4c1-d20b138ae10d","fieldTitle":"Custom Question 7","hintText":"Short description","responseType":"Date","validation":{"mandatory":true}}]}]}',
        '-2', NOW());
`; // if not exists

const insertAdverts: string = `
INSERT INTO public.grant_advert(grant_advert_id, contentful_entry_id, contentful_slug, created, grant_advert_name, last_updated, response, status, version, created_by, last_updated_by, scheme_id, opening_date, closing_date, first_published_date, last_published_date, unpublished_date)
    VALUES(
        '00000000-0000-0000-0000-000000000000', 'cypress_test_contentful_id', 'cypress_test_advert_contentful_slug', now(), 'Cypress - Automated E2E Test Grant V1', now(),
        '{"sections":[{"sectionId":"ELIGIBILITY","sectionTitle":"Eligibility","sectionStatus":"COMPLETE","questions":[{"questionId":"ELIGIBILITY","fieldTitle":"Eligibility Statement","displayText":"eligibility","questionSuffix":"Does your organisation meet the eligibility criteria?","responseType":"YesNo","validation":{"mandatory":true}}]},{"sectionId":"ESSENTIAL","sectionTitle":"Required checks","sectionStatus":"COMPLETE","questions":[{"questionId":"APPLICANT_ORG_NAME","profileField":"ORG_NAME","fieldTitle":"Enter the name of your organisation","hintText":"This is the official name of your organisation. It could be the name that is registered with Companies House or the Charities Commission","adminSummary":"organisation legal name","responseType":"ShortAnswer","validation":{"mandatory":true,"minLength":2,"maxLength":250}},{"questionId":"APPLICANT_TYPE","profileField":"ORG_TYPE","fieldTitle":"Choose your organisation type","hintText":"Choose the option that best describes your organisation","adminSummary":"organisation type (e.g. limited company)","responseType":"Dropdown","validation":{"mandatory":true},"options":["Limited company","Non-limited company","Registered charity","Unregistered charity","Other"]},{"questionId":"APPLICANT_ORG_ADDRESS","profileField":"ORG_ADDRESS","fieldTitle":"Enter your organisation''s address","adminSummary":"registered address","responseType":"AddressInput","validation":{"mandatory":true}},{"questionId":"APPLICANT_ORG_CHARITY_NUMBER","profileField":"ORG_CHARITY_NUMBER","fieldTitle":"Enter your Charity Commission number (if you have one)","hintText":"Funding organisation might use this to identify your organisation when you apply for a grant. It might also be used to check your organisation is legitimate.","adminSummary":"Charity Commission number (if applicable)","responseType":"ShortAnswer","validation":{"mandatory":false,"minLength":2,"maxLength":15,"validInput":"alphanumeric-nospace"}},{"questionId":"APPLICANT_ORG_COMPANIES_HOUSE","profileField":"ORG_COMPANIES_HOUSE","fieldTitle":"Enter your Companies House number (if you have one)","hintText":"Funding organisation might use this to identify your organisation when you apply for a grant. It might also be used to check your organisation is legitimate.","adminSummary":"Companies House number (if applicable)","responseType":"ShortAnswer","validation":{"mandatory":false,"minLength":2,"maxLength":8,"validInput":"alphanumeric-nospace"}},{"questionId":"APPLICANT_AMOUNT","fieldPrefix":"£","fieldTitle":"How much does your organisation require as a grant?","hintText":"Please enter whole pounds only","adminSummary":"amount of funding required","responseType":"Numeric","validation":{"mandatory":true,"greaterThanZero":true}},{"questionId":"BENEFITIARY_LOCATION","fieldTitle":"Where will this funding be spent?","hintText":"Select the location where the grant funding will be spent. You can choose more than one, if it is being spent in more than one location.\\n\\nSelect all that apply:","adminSummary":"where the funding will be spent","responseType":"MultipleSelection","validation":{"mandatory":true},"options":["North East England","North West England","South East England","South West England","Midlands","Scotland","Wales","Northern Ireland"]}]},{"sectionId":"33b0559f-1cf5-4d22-b4a9-c35a300c876e","sectionTitle":"Custom Section","questions":[{"questionId":"c8890343-5722-42d9-845a-6226e4fde6c8","fieldTitle":"Custom Question 1","hintText":"Short description","responseType":"YesNo","validation":{"mandatory":true}},{"questionId":"8c4bf8f9-e175-4bd8-a54f-3d9587767bca","fieldTitle":"Custom Question 2","hintText":"Short description","responseType":"ShortAnswer","validation":{"mandatory":true,"maxLength":250,"minLength":1}},{"questionId":"d864dc12-d12c-411c-9e2f-8097fa8c5b90","fieldTitle":"Custom Question 3","hintText":"Short description","responseType":"LongAnswer","validation":{"mandatory":true,"maxLength":6000,"minLength":2}},{"questionId":"0f0f03e1-9636-4d0d-bd98-e72690307156","fieldTitle":"Custom Question 4","hintText":"Short description","responseType":"Dropdown","validation":{"mandatory":false},"options":["Choice 1","Choice 2"]},{"questionId":"9e9038d1-3911-4e60-9f15-3b2c319506ac","fieldTitle":"Custom Question 5","hintText":"Short description","responseType":"MultipleSelection","validation":{"mandatory":false},"options":["Choice 1","Choice 2"]},{"questionId":"178a34aa-2b23-46db-9831-421db766234c","fieldTitle":"Custom Question 6","hintText":"Short description","responseType":"SingleFileUpload","validation":{"mandatory":true,"maxFileSizeMB":300,"allowedTypes":["DOC","DOCX","ODT","PDF","XLS","XLSX","ZIP"]}},{"questionId":"e228a74a-290c-4b60-b4c1-d20b138ae10d","fieldTitle":"Custom Question 7","hintText":"Short description","responseType":"Date","validation":{"mandatory":true}}]}]}',
        'PUBLISHED', 1, '-2', '-2', '-1', now(), now() + interval '3 days', null, null, null
    );
`; // if not exists

export {
  insertApplicants,
  insertUsers,
  insertFundingOrgs,
  insertAdmins,
  insertGrantApplicantOrgProfiles,
  insertSchemes,
  insertApplications,
  insertAdverts,
};
