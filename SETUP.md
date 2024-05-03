## Getting Started

- To install dependencies, run `npm install`
- You'll then need to copy the `.env.example` file to a file called `.env` and enter the login in details for the accounts you will use for testing. You can obtain these by following the steps below.
  - `ONE_LOGIN_USERNAME` & `ONE_LOGIN_PASSWORD` properties used for signing in to the One Login integration environment - this is a static username/password for the whole environment, and you can obtain these and most other env vars by speaking to Arul. Most env vars are also obtainable via AWS.
    - QA technically does not need authorisation, but the tests expect these env vars to be available so you can just use the same ones as in sandbox.
  - The other email/password/sub combinations are for specific account roles, and should be unique to each user. You should generate them yourself using the steps below.
- ESLint, Prettier and Husky are installed, so your code will auto-format when committing changes.
- Make sure you are connected to the correct VPN for the environment you are running on - you should have been issued with your own VPN profiles which you can use with OpenVPN.
- Tests can be run against QA or Sandbox. You'll need to have the appropriate .env file in order to be able to run tests against each environment. The current `.env` file in use should be called simply `.env` and the other should be called `.env.qa` or `.env.sandbox` respectively.
  - There is a command to switch your current environment between the two: `npm run env:switch` (remember to switch your VPN as well)
- You will need to set up 4 users with One Login, and use these to run E2E tests locally. Steps:
  1. Go to Find a Grant for the environment you wish to run against
  2. Click `Sign in and Apply`
  3. Create a new account for the intended role (you can use the + trick to generate a "new" email still linked to your inbox) until you reach the dashboard. **(passwords cannot contain #)**
     - e.g. example.name+e2e_applicant@cabinetoffice.gov.uk
  4. Repeat steps 2-3 until you have created an applicant, admin, super admin and tech support user (they do not need to actually have that role at this step, just named appropriately)
  5. Put each of these 4 emails into the .env under ONE_LOGIN_APPLICANT_EMAIL, ONE_LOGIN_ADMIN_EMAIL, ONE_LOGIN_SUPER_ADMIN_EMAIL and ONE_LOGIN_TECHNICAL_SUPPORT_EMAIL appropriately.
  6. In terminal at the root of the project, run `npm run subs` to get the subs for each of your users. Example output:
  ```
    ONE_LOGIN_APPLICANT_EMAIL=example+applicant@cabinetoffice.gov.uk
    ONE_LOGIN_APPLICANT_SUB=urn:fdc:gov.uk:20XX:1234567890qwertyuiopasdfghjklzxcvbnm
    ONE_LOGIN_APPLICANT_PASSWORD=XXXXXXXX
    ONE_LOGIN_ADMIN_EMAIL=example+admin@cabinetoffice.gov.uk
    ONE_LOGIN_ADMIN_SUB=urn:fdc:gov.uk:20XX:1234567890qwertyuiopasdfghjklzxcvbnm
    ONE_LOGIN_ADMIN_PASSWORD=XXXXXXXX
    ONE_LOGIN_SUPER_ADMIN_EMAIL=example+super_admin@cabinetoffice.gov.uk
    ONE_LOGIN_SUPER_ADMIN_SUB=urn:fdc:gov.uk:20XX:1234567890qwertyuiopasdfghjklzxcvbnm
    ONE_LOGIN_SUPER_ADMIN_PASSWORD=XXXXXXXX
    ONE_LOGIN_TECHNICAL_SUPPORT_EMAIL=example+technical_support@cabinetoffice.gov.uk
    ONE_LOGIN_TECHNICAL_SUPPORT_SUB=urn:fdc:gov.uk:20XX:1234567890qwertyuiopasdfghjklzxcvbnm
    ONE_LOGIN_TECHNICAL_SUPPORT_PASSWORD=example_password
  ```
  7. Copy the output into your .env
  8. Fill in the passwords
  9. Add a unique FIRST_USER_ID to your `.env`. 
     - You _must_ set the .env FIRST_USER_ID to a number unique to yourself.
     - It will iterate up by the number of users and grants (4 at the time of writing) so please ensure there are no collisions.
     - Incrementing IDs by 10 for each person running tests is safe.
     - Note that the users and grants etc that are created will have NEGATIVE ids to ensure they don't collide with existing data. Only E2E test data should have negative IDs.
     - To check existing IDs you can perform the following DB query against the users DB for the appropriate environment:
     - `SELECT gap_user_id, email, sub, dept_id FROM public.gap_users WHERE gap_user_id < 0;`
  9. Now when you run the tests, the existing users will be purged and recreated with the appropriate roles and IDs.
