## NextJs Demo App

## Environment Variables

Copy `.env.example` to `.env.local`, then add your credentials. Save it without formatting by your code editor!
Note: Use a MongoDB user password, not the account password!

Fill the Ethereum Network name and its associated contract addresses:

```
NEXT_PUBLIC_ETHEREUM_NETWORK=
NEXT_PUBLIC_ETHEREUM_USDT=
NEXT_PUBLIC_ETHEREUM_NFT=
NEXT_PUBLIC_ETHEREUM_NFTSALES=
```

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

## Connect to a Ethereum Local Network

For MetaMask wallet, follow this tutorial: https://docs.metamask.io/wallet/how-to/get-started-building/run-devnet/
Make sure your wallet settings are correct according to Foundry Anvil:

```
http://127.0.0.1:8545/  OR  http://localhost:8545
Anvil chain ID 31337 or 0x7a69 in hexadecimal format
Hardhat chain ID, 1337 or 0x539 in hexadecimal format)
```

Settings > Advanced and select Reset account

## Under Investigation

https://github.com/ethers-io/ethers.js/issues/4428
Cant resolve 'bufferutil' and 'utf-8-validate'
=> pnpm add ws bufferutil utf-8-validate

## Browser Requirement

[NextJs Requirement](https://nextjs.org/docs/getting-started/installation)

[TanStack Query Requirement](https://tanstack.com/query/latest/docs/react/installation) from the creators of Next.js.

[TradingView Lightweight Charts v4.1 Requirement](https://tradingview.github.io/lightweight-charts/docs#requirements): es2016 language specification
