const updateSpotlightSubmissionStatus: string = `
    UPDATE public.spotlight_submission
    SET status = $1, last_send_attempt = NOW(),
    id = $2
    WHERE grant_scheme = $3;
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

const addSubmissionToMostRecentBatch = `
    INSERT INTO public.spotlight_batch_submission(spotlight_submission_id, spotlight_batch_id)
    VALUES ($1, $2);
`;

const insertSubmissions = `
INSERT INTO public.grant_submission (id, application_name, created, definition, last_updated, status, submitted_date, version, applicant_id, application_id, created_by, last_updated_by, scheme_id, gap_id)
    VALUES (
        $1, 'Cypress - Test Application V1 Internal', now(),
        '{"sections":[{"sectionId":"ELIGIBILITY","sectionTitle":"Eligibility","sectionStatus":"COMPLETED","questions":[{"attachmentId":null,"questionId":"ELIGIBILITY","profileField":null,"fieldTitle":"Eligibility Statement","displayText":"eligibility","hintText":null,"questionSuffix":"Does your organisation meet the eligibility criteria?","fieldPrefix":null,"adminSummary":null,"responseType":"YesNo","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"Yes","multiResponse":null}]},{"sectionId":"ESSENTIAL","sectionTitle":"Required checks","sectionStatus":"COMPLETED","questions":[{"attachmentId":null,"questionId":"APPLICANT_ORG_NAME","profileField":"ORG_NAME","fieldTitle":"Enter the name of your organisation","displayText":null,"hintText":"This is the official name of your organisation. It could be the name that is registered with Companies House or the Charities Commission","questionSuffix":null,"fieldPrefix":null,"adminSummary":"organisation legal name","responseType":"ShortAnswer","validation":{"mandatory":true,"minLength":2,"maxLength":250,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"My First Org","multiResponse":null},{"attachmentId":null,"questionId":"APPLICANT_TYPE","profileField":"ORG_TYPE","fieldTitle":"Choose your organisation type","displayText":null,"hintText":"Choose the option that best describes your organisation","questionSuffix":null,"fieldPrefix":null,"adminSummary":"organisation type (e.g. limited company)","responseType":"Dropdown","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":["Limited company","Non-limited company","Registered charity","Unregistered charity","Other"],"response":"Limited company","multiResponse":null},{"attachmentId":null,"questionId":"APPLICANT_ORG_ADDRESS","profileField":"ORG_ADDRESS","fieldTitle":"Enter your organisation''s address","displayText":null,"hintText":null,"questionSuffix":null,"fieldPrefix":null,"adminSummary":"registered address","responseType":"AddressInput","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":null,"multiResponse":["Address line 1","Address line 2","Town","County","Postcode"]},{"attachmentId":null,"questionId":"APPLICANT_ORG_CHARITY_NUMBER","profileField":"ORG_CHARITY_NUMBER","fieldTitle":"Enter your Charity Commission number (if you have one)","displayText":null,"hintText":"Funding organisation might use this to identify your organisation when you apply for a grant. It might also be used to check your organisation is legitimate.","questionSuffix":null,"fieldPrefix":null,"adminSummary":"Charity Commission number (if applicable)","responseType":"ShortAnswer","validation":{"mandatory":false,"minLength":2,"maxLength":15,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":"alphanumeric-nospace","maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"","multiResponse":null},{"attachmentId":null,"questionId":"APPLICANT_ORG_COMPANIES_HOUSE","profileField":"ORG_COMPANIES_HOUSE","fieldTitle":"Enter your Companies House number (if you have one)","displayText":null,"hintText":"Funding organisation might use this to identify your organisation when you apply for a grant. It might also be used to check your organisation is legitimate.","questionSuffix":null,"fieldPrefix":null,"adminSummary":"Companies House number (if applicable)","responseType":"ShortAnswer","validation":{"mandatory":false,"minLength":2,"maxLength":8,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":"alphanumeric-nospace","maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"","multiResponse":null},{"attachmentId":null,"questionId":"APPLICANT_AMOUNT","profileField":null,"fieldTitle":"How much does your organisation require as a grant?","displayText":null,"hintText":"Please enter whole pounds only","questionSuffix":null,"fieldPrefix":"£","adminSummary":"amount of funding required","responseType":"Numeric","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":true,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"100","multiResponse":null},{"attachmentId":null,"questionId":"BENEFITIARY_LOCATION","profileField":null,"fieldTitle":"Where will this funding be spent?","displayText":null,"hintText":"Select the location where the grant funding will be spent. You can choose more than one, if it is being spent in more than one location.\\n\\nSelect all that apply:","questionSuffix":null,"fieldPrefix":null,"adminSummary":"where the funding will be spent","responseType":"MultipleSelection","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":["North East England","North West England","South East England","South West England","Midlands","Scotland","Wales","Northern Ireland"],"response":null,"multiResponse":["North East England","North West England","South East England","South West England","Midlands","Scotland","Wales","Northern Ireland"]}]},{"sectionId":"33b0559f-1cf5-4d22-b4a9-c35a300c876e","sectionTitle":"Custom Section","sectionStatus":"COMPLETED","questions":[{"attachmentId":null,"questionId":"c8890343-5722-42d9-845a-6226e4fde6c8","profileField":null,"fieldTitle":"Custom Question 1","displayText":null,"hintText":"Short description","questionSuffix":null,"fieldPrefix":null,"adminSummary":null,"responseType":"YesNo","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"Yes","multiResponse":null},{"attachmentId":null,"questionId":"8c4bf8f9-e175-4bd8-a54f-3d9587767bca","profileField":null,"fieldTitle":"Custom Question 2","displayText":null,"hintText":"Short description","questionSuffix":null,"fieldPrefix":null,"adminSummary":null,"responseType":"ShortAnswer","validation":{"mandatory":true,"minLength":1,"maxLength":250,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"input 1","multiResponse":null},{"attachmentId":null,"questionId":"d864dc12-d12c-411c-9e2f-8097fa8c5b90","profileField":null,"fieldTitle":"Custom Question 3","displayText":null,"hintText":"Short description","questionSuffix":null,"fieldPrefix":null,"adminSummary":null,"responseType":"LongAnswer","validation":{"mandatory":true,"minLength":2,"maxLength":6000,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"input 2","multiResponse":null},{"attachmentId":null,"questionId":"0f0f03e1-9636-4d0d-bd98-e72690307156","profileField":null,"fieldTitle":"Custom Question 4","displayText":null,"hintText":"Short description","questionSuffix":null,"fieldPrefix":null,"adminSummary":null,"responseType":"Dropdown","validation":{"mandatory":false,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":["Choice 1","Choice 2"],"response":"Choice 1","multiResponse":null},{"attachmentId":null,"questionId":"9e9038d1-3911-4e60-9f15-3b2c319506ac","profileField":null,"fieldTitle":"Custom Question 5","displayText":null,"hintText":"Short description","questionSuffix":null,"fieldPrefix":null,"adminSummary":null,"responseType":"MultipleSelection","validation":{"mandatory":false,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":["Choice 1","Choice 2"],"response":null,"multiResponse":["Choice 1","Choice 2"]},{"attachmentId":"c863df4c-a502-4cc8-a33b-f0b3043a8c55","questionId":"178a34aa-2b23-46db-9831-421db766234c","profileField":null,"fieldTitle":"Custom Question 6","displayText":null,"hintText":"Short description","questionSuffix":null,"fieldPrefix":null,"adminSummary":null,"responseType":"SingleFileUpload","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":300,"allowedTypes":["DOC","DOCX","ODT","PDF","XLS","XLSX","ZIP"]},"options":null,"response":"example.doc","multiResponse":null},{"attachmentId":null,"questionId":"e228a74a-290c-4b60-b4c1-d20b138ae10d","profileField":null,"fieldTitle":"Custom Question 7","displayText":null,"hintText":"Short description","questionSuffix":null,"fieldPrefix":null,"adminSummary":null,"responseType":"Date","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":null,"multiResponse":["01","01","2000"]}]}]}',
        now(), 'SUBMITTED', now(), 1, $2, $3, $4, $5, $6, $7
    ),(
        $8, 'Cypress - Test Application V2 Internal', now(),
        '{"sections":[{"sectionId":"ELIGIBILITY","sectionTitle":"Eligibility","sectionStatus":"COMPLETED","questions":[{"attachmentId":null,"questionId":"ELIGIBILITY","profileField":null,"fieldTitle":"Eligibility Statement","displayText":"eligibility","hintText":null,"questionSuffix":"Does your organisation meet the eligibility criteria?","fieldPrefix":null,"adminSummary":null,"responseType":"YesNo","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"Yes","multiResponse":null}]},{"sectionId":"ORGANISATION_DETAILS","sectionTitle":"Your organisation","sectionStatus":"COMPLETED","questions":[{"attachmentId":null,"questionId":"APPLICANT_TYPE","profileField":"ORG_TYPE","fieldTitle":"Type of organisation","displayText":null,"hintText":"Choose the option that best describes your organisation","questionSuffix":null,"fieldPrefix":null,"adminSummary":"organisation type (e.g. limited company)","responseType":"Dropdown","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":["Limited company","Non-limited company","Registered charity","Unregistered charity","Other","Charity","I am applying as an individual"],"response":"Limited company","multiResponse":null},{"attachmentId":null,"questionId":"APPLICANT_ORG_NAME","profileField":"ORG_NAME","fieldTitle":"Name","displayText":null,"hintText":"This is the official name of your organisation. It could be the name that is registered with Companies House or the Charities Commission","questionSuffix":null,"fieldPrefix":null,"adminSummary":"organisation legal name","responseType":"ShortAnswer","validation":{"mandatory":true,"minLength":0,"maxLength":250,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"MyOrg","multiResponse":null},{"attachmentId":null,"questionId":"APPLICANT_ORG_ADDRESS","profileField":"ORG_ADDRESS","fieldTitle":"Address","displayText":null,"hintText":null,"questionSuffix":null,"fieldPrefix":null,"adminSummary":"Enter your organisations address","responseType":"AddressInput","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":null,"multiResponse":["addressLine1","addressLine2","city","county","postcod"]},{"attachmentId":null,"questionId":"APPLICANT_ORG_CHARITY_NUMBER","profileField":"ORG_CHARITY_NUMBER","fieldTitle":"Enter your Charity Commission number","displayText":null,"hintText":"Funding organisation might use this to identify your organisation when you apply for a grant. It might also be used to check your organisation is legitimate.","questionSuffix":null,"fieldPrefix":null,"adminSummary":"Charity Commission number","responseType":"ShortAnswer","validation":{"mandatory":false,"minLength":2,"maxLength":15,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":"alphanumeric-nospace","maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"67890","multiResponse":null},{"attachmentId":null,"questionId":"APPLICANT_ORG_COMPANIES_HOUSE","profileField":"ORG_COMPANIES_HOUSE","fieldTitle":"Enter your Companies House number","displayText":null,"hintText":"Funding organisation might use this to identify your organisation when you apply for a grant. It might also be used to check your organisation is legitimate.","questionSuffix":null,"fieldPrefix":null,"adminSummary":"Companies House number","responseType":"ShortAnswer","validation":{"mandatory":false,"minLength":2,"maxLength":8,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":"alphanumeric-nospace","maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"12345","multiResponse":null}]},{"sectionId":"FUNDING_DETAILS","sectionTitle":"Funding","sectionStatus":"COMPLETED","questions":[{"attachmentId":null,"questionId":"APPLICANT_AMOUNT","profileField":null,"fieldTitle":"How much does your organisation require as a grant?","displayText":null,"hintText":"Please enter whole pounds only","questionSuffix":null,"fieldPrefix":"£","adminSummary":"amount of funding required","responseType":"Numeric","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":null,"response":"100","multiResponse":null},{"attachmentId":null,"questionId":"BENEFITIARY_LOCATION","profileField":null,"fieldTitle":"Where will this funding be spent?","displayText":null,"hintText":"Select the location where the grant funding will be spent. You can choose more than one, if it is being spent in more than one location.\\n\\nSelect all that apply:","questionSuffix":null,"fieldPrefix":null,"adminSummary":"where the funding will be spent","responseType":"MultipleSelection","validation":{"mandatory":true,"minLength":null,"maxLength":null,"minWords":null,"maxWords":null,"greaterThanZero":null,"validInput":null,"maxFileSizeMB":0,"allowedTypes":null},"options":["North East England","North West England","South East England","South West England","Midlands","Scotland","Wales","Northern Ireland"],"response":null,"multiResponse":["North East (England)","North West (England)","Yorkshire and the Humber","East Midlands (England)","West Midlands (England)","London","South East (England)","South West (England)","Scotland","Wales","Northern Ireland","Outside of the UK"]}]}]}',
        now(), 'SUBMITTED', now(), 2, $9, $10, $11, $12, $13, $14
    );
`;

const insertMandatoryQuestions = `
INSERT INTO public.grant_mandatory_questions (id, grant_scheme_id, submission_id, name, address_line_1, address_line_2, city, county, postcode, org_type, companies_house_number, charity_commission_number, funding_amount, funding_location, status, version, created, created_by, last_updated, last_updated_by, gap_id)
    VALUES (
        $1, $2, $3,
        'MyOrg', 'addressLine1', 'addressLine2', 'city', 'county', 'postcod', 'LIMITED_COMPANY', '12345', '67890', 100,
        '{NORTH_EAST_ENGLAND,NORTH_WEST_ENGLAND,YORKSHIRE_AND_THE_HUMBER,EAST_MIDLANDS_ENGLAND,WEST_MIDLANDS,LONDON,SOUTH_EAST_ENGLAND,SOUTH_WEST_ENGLAND,SCOTLAND,WALES,NORTHERN_IRELAND,OUTSIDE_UK}',
        'COMPLETED', 1, now(), $4, now(), $5, $6
    ), (
        $7, $8, null,
        'MyOrg', 'addressLine1', 'addressLine2', 'city', 'county', 'postcod', 'LIMITED_COMPANY', '12345', '67890', 100,
        '{NORTH_EAST_ENGLAND,NORTH_WEST_ENGLAND,YORKSHIRE_AND_THE_HUMBER,EAST_MIDLANDS_ENGLAND,WEST_MIDLANDS,LONDON,SOUTH_EAST_ENGLAND,SOUTH_WEST_ENGLAND,SCOTLAND,WALES,NORTHERN_IRELAND,OUTSIDE_UK}',
        'COMPLETED', 1, now(), $9, now(), $10, $11
    );
`;

const insertSpotlightSubmission = `
INSERT INTO public.spotlight_submission (id, grant_mandatory_questions_id, grant_scheme, status, last_send_attempt, version, created, last_updated)
    VALUES (
        $1, $2, $3, 'QUEUED', null, 1, now(), now()
    )
`;

export {
  readdQueuedSpotlightSubmissions,
  removeQueuedSpotlightSubmissions,
  updateSpotlightSubmissionStatus,
  addSubmissionToMostRecentBatch,
  insertSubmissions,
  insertMandatoryQuestions,
  insertSpotlightSubmission,
};
