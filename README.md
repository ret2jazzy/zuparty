# Zuparty App (Forked from Zupoll) 

## Introducing Zuzalu.Party: A New Webapp for the Zuzalu Community

Hello, Zuzalians! We are excited to announce the launch of Zuzalu.Party, a webapp designed to bring our unique pop-up city community in Montenegro even closer together. This platform utilizes a zero-knowledge proof-of-membership (Zupass) to create an exclusive space for all Zuzalu members to connect, share ideas, and foster new connections.

### Philosophy and Values of Zuzalu.Party
Zuzalu.Party embodies the core principles of our community-driven, borderless nation. We believe that gatherings and parties serve as catalysts for new ideas, connections, and shared interests. While the goal is not exclusion, we understand that hosts may have multidimensional concerns, and we aim to provide an easy and flexible platform to accommodate them.

### Connecting with ZuPass
To ensure the authenticity of Zuzalu events and members, creators and hosts must connect their ZuPass. This way, we can guarantee that only bona fide Zuzalu residents participate in our events. We trust our hosts and creators to create ideal environments and experiences for guests while verifying their authenticity.

### Privacy and Information Leakage
We are committed to minimizing information leakage, only gathering PII and sharing essential details for practical considerations, such as Telegram reminders. By keeping the user interface simple and straightforward, we prioritize your privacy and convenience.

### Identity and Flexibility
While it's crucial to maintain the Zuzalu identity, we also understand the importance of balancing flexibility and mobile access. For this reason, we have chosen not to make the Passport mandatory for RSVP-ing in the initial version of the app. This decision aims to provide a more accessible and user-friendly experience for all Zuzalians.

### Smaller Scale Events and Inclusivity
Zuzalu.Party is designed to facilitate smaller scale events run by individual hosts, from casual house gatherings to interesting curated experiences. We want to empower you, our community members, to choose who to invite, as an additional option to events that are by default “first come first serve.” As Zuzalu already offers two ways to join the community for non-members (visitor passes and family passes), we hope this extends to a third use case: “party passes” that apply to event-goers with the right energy and shared interests for a smaller-scale event.

Join us on this exciting journey to foster an even stronger sense of community in our pop-up city, Zuzalu. With Zuzalu.Party, let's continue to celebrate our shared interests, generate new ideas, and forge lasting connections!



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
