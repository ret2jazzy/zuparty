# Zuparty App (Forked from Zupoll) 

## For Developers: Local Development

### Environment Variables

In order to develop locally, you will need to set some environment variables.
In `zuparty-client` prroject, we have included an example
environment variable file here: [apps/zuparty-client/.env.local.example](apps/zuparty-client/.env.local.example).
In order to make the `zuparty-client` use these environment variables, you will need to copy the contents of the example file into an adjacent file called `.env.local`.
In `zuparty-server` prroject, we have included an example
environment variable file here: [apps/zuparty-server/.env.example](apps/zuparty-server/.env.example).
In order to make the `zuparty-server` use these environment variables, you will need to copy the contents of the example file into an adjacent file called `.env`.

### Running the project

Note, this project depends on the [Zuzalu Passport project](https://github.com/proofcarryingdata/zupass).
You have to make sure the passport server and client running first.

In the root of this project, execute the following to start the servers and static sites locally.

```bash
# installs dependencies for all apps and packages in this repository
yarn

# set the postgres connection url in the env file (DATABASE_URL)
# this will need to you manually create a database for zuparty.

# prepare local Postgres - you must have Postgres installed for this
# to work properly.
yarn db:generate && yarn db:push

# starts all the applications contained in the `/apps` directory of the
# repository. this includes the zuparty server and client.
yarn dev

# open up the zuparty app in your browser.
open http://localhost:3004
```
