## Getting Started

- To install dependencies, run `npm install`
- You'll then need to copy the `.env.example` file to a file called `.env` and enter the login in details for the accounts you will use for testing. You can obtain these by following the steps below.
  - `ONE_LOGIN_SANDBOX_` properties used for signing in to the One Login integration environment - this is a static username/password for the whole environment, and you can obtain these by speaking to Conor Fayle (or probably most devs by this point).
  - The other email/password combinations are for specific accounts.
- ESLint, Prettier and Husky are installed, so your code will auto-format when committing changes.
- Make sure you are connected to the correct VPN for the environment you are running on - you should have been issued with your own VPN profiles which you can use with OpenVPN.
- Tests can be run against QA or Sandbox. You'll need to have the appropriate .env file in order to be able to run tests against each environment. The current `.env` file in use should be called simply `.env` and the other should be called `.env.qa` or `.env.sandbox` respectively.
  - There is a command to switch your current environment between the two: `npm run env:switch`
- You will need to set up 3 users with One Login, and use these to run E2E tests locally. Steps:
  1. Go to Find a Grant for the environment you wish to run against
  2. Click `Sign in and Apply`
  3. Create a new account for the intended role (you can use the + trick to generate a "new" email still linked to your inbox) until you reach the dashboard **(passwords cannot contain #)**
  4. Repeat steps 2-3 for applicant, admin and super admin
  5. Put each of these 3 emails into the .env under ONE_LOGIN_APPLICANT_EMAIL, ONE_LOGIN_ADMIN_EMAIL and ONE_LOGIN_SUPER_ADMIN_EMAIL appropriately.
  6. Add yourself to the VPC if you haven't already (`npm run vpc:add`)
  7. Run `npm run subs` to get the subs for each of your users
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
  ```
  8. Copy the output into your .env
  9. Fill in the passwords
- You _must_ set the .env FIRST_USER_ID to a number unique to yourself. It will iterate up by the number of users and grants (3 at the time of writing) so please ensure there are no collisions.
