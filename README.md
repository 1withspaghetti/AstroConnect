# Astro Connect

> AstroConnect is an open-source project created by Tyler Place at Cal Poly SLO. It was created as Summer Project at UW Astro, supervised/mentored by Ishan Ghosh-Coutinho. A then Post-Baccalaureate with the department, Ishan reached out to Tyler after desiring to bridge the lack of connection between students looking for research opportunities and faculty/researchers who might provide those opportunities. With help from Ishan constantly communicating, providing feedback, and getting input from potential users, Tyler designed and developed this platform, and hopes it will be a useful resource for the Astronomy community at UW. The project is now managed by Matt McQuinn at the faculty level and Post-Baccalaureate Ruby Hiedgerken, who is serving as the student liaison, with Tyler and Ishan only providing support remotely.

## Features
- Students/Researchers can create detailed profiles for themselves
- Researchers can post Research Opportunities
  - Including descriptions, tags, expiration dates, and a custom application form builder (similar to google forms)
- Students can search though opportunities and apply to them
- Searchable list of active researcher profiles
- Email integration for when students apply to research
- Admin panel
  - Admins can edit, delete, and use the website as a different user
  - Prevent spam and misuse
  - Assist others with tech support

## Technology
- [Typescript](https://www.typescriptlang.org/)
- [SvelteKit](https://kit.svelte.dev/)
- [NeonDB](https://neon.com/) (postgres)
- [Drizzle ORM](https://orm.drizzle.team/)
- [S3](https://aws.amazon.com/s3/)/[R2](https://r2.cloudflare.com/) (for file uploads)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN Svelte](https://www.shadcn-svelte.com/) (for UI components)
- [Lucia](https://lucia-auth.com/) with [Google OAuth](https://developers.google.com/identity/protocols/oauth2) (for authentication)
- [ESList](https://eslint.org/) (for code checking)
- [Prettier](https://prettier.io/) (for code formatting)

# Developing

## Program Prerequisites

### Required Programs:
- [NodeJS](https://nodejs.org/en), a JavaScript Engine
- [pnpm](https://pnpm.io/installation#using-corepack), a package manager for handling libraries
  - Its recommended to use `corepack enable pnpm` install install it, corepack is included in the NodeJS install
- [Git](https://git-scm.com/), for source control
  
### Recommended Programs:
- [VSCode](https://code.visualstudio.com/Download), an all around IDE
  - Recommended Extensions:
    - [Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
    - [Svelte Intellisense](https://marketplace.visualstudio.com/items?itemName=ardenivanov.svelte-intellisense)
    - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Local Project Setup

Download and navigate to the repo:
```shell
git clone https://github.com/1withspaghetti/AstroConnect
cd AstroConnect
```

Install the libraries with pnpm:
```shell
pnpm install
```

### Commands

Start the development server:
```shell
pnpm run dev
```

Check code quality:
```shell
# Run ESLint
pnpm run lint
# Use prettier to format the code
pnpm run format
# Check types using typescript
pnpm run check
```

Build the project and preview it:
```shell
pnpm run build
pnpm run preview
```

Database actions:
```shell
# Push local db schema to database
pnpm run db:push
# Open drizzle studio to view/edit data
pnpm run db:studio

# Learn more here: https://orm.drizzle.team/docs/kit-overview
```

## Configuring environment variables

Create a copy of [`.env.example`](/.env.example) named `.env` to define environment variables, or use the hosting service's panel to define them.

**Refer to the [3rd Party Services](#3rd-party-services) section for more information on how to set up the required services.**
```properties
# App
# Use localhost for development, change for production
PUBLIC_BASE_URL="http://localhost:5173"
# The required suffix for all user emails in order to create an account
EMAIL_SUFFIX="@uw.edu"
# Comma-separated list of emails, where the user will automatically become an admin when they log in for the first time. This does not affect existing users.
INITIAL_ADMIN_EMAILS="admin1@example.com,admin2@example.com"

# Database
# Replace with your actual database connection string
DATABASE_URL="postgres://user:password@host:port/db-name"

# Auth
# Created by registering a new app at https://console.developers.google.com/
GOOGLE_CLIENT_ID="ID_HERE"
GOOGLE_CLIENT_SECRET="SECRET_HERE"

# Mailjet
# Replace with your actual Mailjet API keys
MJ_SENDER_EMAIL="noreply@website.com"
MJ_SENDER_NAME="AstroConnect"
MJ_APIKEY_PUBLIC="your-mailjet-public-key"
MJ_APIKEY_PRIVATE="your-mailjet-private-key"

# S3 Bucket for file transfer uploads
# Suggested to use cloudflare r2 or aws s3
S3_ACCESS_KEY_ID="ACCESS_KEY"
S3_SECRET_ACCESS_KEY="SECRET_KEY"
S3_ENDPOINT="ENDPOINT" # e.g. https://[ACCOUNT_ID].r2.cloudflarestorage.com
S3_BUCKET_IMAGES="images" # Where all the profile pictures and post images are stored, needs to be publicly accessible via the url below
S3_BUCKET_IMAGES_PUBLIC_URL="https://images.website.com" # Where the S3_BUCKET_IMAGES are publicly accessible
S3_BUCKET_TEMP_UPLOADS="temp-uploads" # For temporary file uploads, files are stored here when uploaded, and then moved to S3_BUCKET_UPLOADS when the application is submitted
S3_BUCKET_UPLOADS="-uploads" # Where all the files included in an application are stored
S3_BUCKET_UPLOADS_PUBLIC_URL="https://uploads.website.com" # Where the S3_BUCKET_UPLOADS are publicly accessible
```

## 3rd Party Services
To run the app, you will need to set up a few services and environment variables.

### NeonDB

You will need a [NeonDB Database](https://neon.com/) (or just postgres, but that will require changing some code). They have a very generous free plan, which was my main motivation for choosing them.

Follow the instructions on the website to create an account and obtain a connection string.

Then, set the following environment variables to allow the app to access the db:
```properties
DATABASE_URL="postgres://user:password@host:port/db-name"
```

Make sure to run the command below to push the app schemas to the database, and run it again if you change any of them.
```shell
pnpm run db:push
```

### S3/R2 Bucket
You will need an S3 bucket to store file uploads. You can use [Cloudflare R2](https://r2.cloudflare.com/) (suggested) or [AWS S3](https://aws.amazon.com/s3/) for this. You can keep the bucket private, as the app will handle file access through signed URLs.

Make sure to set the following environment variables to allow the app to access the bucket:
```properties
S3_ACCESS_KEY_ID="ACCESS_KEY"
S3_SECRET_ACCESS_KEY="SECRET_KEY"
S3_ENDPOINT="https://[BUCKET_NAME].[ACCOUNT_ID].r2.cloudflarestorage.com"
S3_BUCKET_NAME="BUCKET_NAME"
# ... don't forget the bucket name env vars too! (see .env.example)
```

**IF USING CLOUDFLARE R2:** Make sure to set the correct CORS Policy in the bucket dashboard settings:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://astroconnect.org"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST"
    ],
    "AllowedHeaders": [
      "Content-Type"
    ]
  }
]
```

### Google OAuth

Follow instructions [here](https://support.google.com/googleapi/answer/6158849?hl=en).

In the cloud console, make sure to add the following as **Authorized JavaScript origins**:

- `https://astroconnect.org`
- `http://localhost:5173`

And the following as **Authorized redirect URIs**:

- `https://astroconnect.org/login/google/callback`
- `http://localhost:5173/login/google/callback`

And finally define the environment variables in `.env` or your hosting provider:

```properties
GOOGLE_CLIENT_ID="[id].apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="[secret]"
```

### MailJet

You need to create a [MailJet](https://www.mailjet.com/) account, generate an API token, and update the respective environment variables.

```properties
MJ_SENDER_EMAIL="noreply@website.com"
MJ_SENDER_NAME="AstroConnect"
MJ_APIKEY_PUBLIC="your-mailjet-public-key"
MJ_APIKEY_PRIVATE="your-mailjet-private-key"
```

Don't worry about creating a custom template or any of that, the app internally uses MJML templates to generate email html code which is them sent directly to the api.
