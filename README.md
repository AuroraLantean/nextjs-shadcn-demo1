## NextJs Demo App

## Install a NPM Package Manager and Install this repository packages

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

## Deploy Solidity Smart Contracts on a Local Ethereum Network

[Install Foundry](https://book.getfoundry.sh/getting-started/installation)
Then start a local Ethereum network via Anvil: `anvil`

Download the Solidity Codebase at [here](https://github.com/AuroraLantean/foundry-d2)
Run tests on ERC721 Sales smart contract: `bun run erc721sales`

Deploy the ERC20, ERC721, and the ERC721 Sales smart contracts onto the Anvil Local Ethereum network:
`bun run erc721sales_deployAnvil`

Copy the compiled Solidity ABI files with deployment contract addresses into this frontend project repository: `bun run erc721sales_makeabi`

## Connect A Web3 Browser Wallet to A Local OR Remote Ethereum Network

#### Connect A Web3 Browser Wallet to A Local Ethereum Network

For MetaMask wallet, follow this tutorial: https://docs.metamask.io/wallet/how-to/get-started-building/run-devnet/
Make sure your wallet settings are correct according to Foundry Anvil:

```
Network Name: Anvil 8545
URL = http://127.0.0.1:8545  OR  http://localhost:8545
Anvil chain ID 31337 or 0x7a69 in hexadecimal format
Currency symbol: ETH
```

For a Hardhat local Ethereum network, use `chain ID 1337` or `0x539` in hexadecimal format

Every time when a new local Ethereum network is launched, you must clear all your previous wallet transaction history. For example in MetaMast: Click on the top right three dots, then `Settings`, then `Advanced`, then `Clear Activities Tab Data`

#### Connect A Web3 Browser Wallet to The Ethereum Sepolia Network

URL = use the default Sepolia URL in MetaMask or get one from Infura or Alchemy
Sepolia chain ID `11155111` or `0xaa36a7` in hexadecimal format

## Set NextJs Environment Variables

Copy `.env.example` to `.env.local`, then add your credentials. Save it without formatting by your code editor!
Note: Use a MongoDB user password, not the account password!

Fill the Ethereum Network name and its associated contract addresses:

```
NEXT_PUBLIC_ETHEREUM_NETWORK=
NEXT_PUBLIC_ETHEREUM_USDT=
NEXT_PUBLIC_ETHEREUM_NFT=
NEXT_PUBLIC_ETHEREUM_NFTSALES=
```

## Run this NextJs application

I use Bun to run the development because of its speed, but you should be able to use PNPM or NPM or Yarn to run it as well.
Install Bun: [here](https://bun.sh/docs/installation)
Then run this app by:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. I use Firefox during development.

For unknown reasons, NextJs cannot launch the app properly in the very first time. So you need to press `F5` on your keyboard to reload your web browser again after launching the NextJs, so the NextJs can work properly.

Initially, the app should use the default web3 provider via Infura API to load the page.
Then you should click on the `Connect to wallet` button on the top of the home page to connect your Web3 Wallet to this app.

Confirm your initial ETH balance and the token balance on the home page. This token is the token address set inside the ERC721 Sales smart contract during its deployment, or you can reset the token address after deployment.

## Under Investigation

Cant resolve 'bufferutil' and 'utf-8-validate'
=> pnpm add ws bufferutil utf-8-validate
https://github.com/ethers-io/ethers.js/issues/4428

React-Email
https://github.com/resendlabs/react-email/issues/977

## Development Requirement

[NextJs 14 requires Node v18.17](https://nextjs.org/blog/next-14) Or Bun 1.0.7

## Browser Requirement

[NextJs Requirement](https://nextjs.org/docs/getting-started/installation)

[TanStack Query Requirement](https://tanstack.com/query/latest/docs/react/installation) from the creators of Next.js.

[TradingView Lightweight Charts v4.1 Requirement](https://tradingview.github.io/lightweight-charts/docs#requirements): es2016 language specification
