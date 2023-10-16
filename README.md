## NextJs Demo App

## Environment Variables

Copy `.env.example` to `.env.local`, then add your credentials. Save it without formatting by your code editor!
Note: Use a MongoDB user password, not the account password!

## Install NPM Package Manager and this repo packages

See [PNPM installation](https://pnpm.io/installation)
Then install this repository packages:

```bash
pnpm install
```

[Notice] use v1.0.4 for Radix UI @radix-ui/react-dialog@1.0.4 and @radix-ui/react-alert-dialog@1.0.4 for the DialogPortalProp error

[Notice] use @react-email/tailwind@^0.0.8 instead of @react-email/tailwind@0.0.9 for the ReactServerComponentsError

```bash
pnpm add @radix-ui/react-dialog@1.0.4 @radix-ui/react-alert-dialog@1.0.4 @react-email/tailwind@^0.0.8
```

## Run the application

I use Bun to run the development because of its speed, but you should be able to use PNPM or NPM or Yarn to run it as well.
Install [Bun](https://bun.sh/docs/installation)
Then run this app by:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Browser Requirement

[NextJs Requirement](https://nextjs.org/docs/getting-started/installation)

[TanStack Query Requirement](https://tanstack.com/query/latest/docs/react/installation) from the creators of Next.js.
