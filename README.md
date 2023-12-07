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

If for unknown reasons, NextJs cannot launch the app properly in the very first time. You need to press `F5` on your keyboard to reload your web browser again after launching the NextJs, so the NextJs can work properly.

Initially, the app should use the default web3 provider via Infura API to load the page.

Go to your browser wallet to choose the account you want to connect to. Then come back to this app and click on the `Connect to wallet` button on the top of the home page to connect your Web3 Wallet to this app.

Wagmi should prompt you to switch to the correct network with deployed contracts.
If you want to use another account, go to your browser wallet to choose the account you want to connect to. Then come back to this app and click on `Disconnect` then `Connect to Wallet`

Confirm your initial ETH balance and the token balance on the home page. This token is the token address set inside the ERC721 Sales smart contract during its deployment, or you can reset the token address after deployment.

#### If you do not have the tokens that is accepted by the NFT Sales contract:

In the dropdown: choose the USDT or TokenX on Ethereum/Other Chain
In the Radio buttons: choose `Mint Tokens To Guest`
Click on the `Submit to Blockchain` button then your Browser wallet should pop up for you to click proceed.
After the transaction has been submitted and finalized, you should see your Browser Wallet's notice on your screen. Then click on the left `Go` button to refresh your balances. You should see your token balance has increased by 100.

#### If the Sales contract has sold out all NFT:

In the dropdown: choose the `DragonNFT on Ethereum/Other Chain`
In the Radio buttons: choose `Mint NFTs to Sales Contract`, enter a NFT ID in the form first field. This NFT ID should not have beem minted before. Just try a few numbers until you made it through. The NFT contract will mint 3 new NFTs starting from your chosen NFT ID.
Then click on the left `Go` button to refresh your balances. You should see the Sales Contract have three new NFTs.

Now. In the dropdown: choose the `Sales Contract on Ethereum/Other Chain`
In the Radio buttons: choose `Set Price by Guest`, then click on `Submit to Blockchain`. This will automatically set the new NFT prices as 0.001 ETH, 100 Token, and 100 Token respectively.

#### Buy NFTs via Native Asset

You need to get some Native Assets like ETH for Ethereum blockchain. If the smart contracts are deployed on testnet like Sepolia or Mumbai, you can get some native assets for free. This app cannot generate those for you.

The first NFT will always be set to 0.001 ETH by the `Set Price by Guest` function. So you have to get this amount if you want to buy the first NFT.

Still keep the contract dropdown to `Sales contract on Ethereum/Other chain`
Enter your first NFT id in the first form field, then click on `Submit to Blockchain`. After transaction finalization, you should see your NFT collection has increased by a new NFT ID.

#### Buy NFTs via Tokens

Now. In the dropdown: choose the `TokenX on Ethereum/Other Chain`. E.g. USDT on Ethereum/Other Chain.

In the Radio buttons: choose `Approve`. Enter an amount in the field `Amount` in the form, and that amount is bigger than the sum of all the NFTs you want to buy today.
Click on `Submit to Blockchain`. This will approve the Sales Contract to take your tokens during the transaction below.

In the dropdown: choose the `Sales Contract on Ethereum/Other Chain`.
In the Radio buttons: choose `Buy NFT via Token`.
Enter the NFT ID in the first for field, then click on `Submit to Blockchain`.

After the transaction has been submitted and finalize. Then click on the left `Go` button to refresh your balances. You should see your NFT collection has increased by a new NFT ID.

## Known Issues

`CORS: rpc.sepolia.org has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource`
This turns out to be an issue from the Sepolia.org APIs, because I have no control over which domains they would accept requests from.

## Under Investigation

Cant resolve 'bufferutil' and 'utf-8-validate'
=> pnpm add ws bufferutil utf-8-validate
https://github.com/ethers-io/ethers.js/issues/4428

React-Email
https://github.com/resendlabs/react-email/issues/977

Popover
https://github.com/shadcn-ui/ui/issues/1511#issuecomment-1810682366

## Development Requirement

[NextJs 14 requires Node v18.17](https://nextjs.org/blog/next-14) Or Bun 1.0.7

## Browser Requirement

[NextJs Requirement](https://nextjs.org/docs/getting-started/installation)

[TanStack Query Requirement](https://tanstack.com/query/latest/docs/react/installation) from the creators of Next.js.

[TradingView Lightweight Charts v4.1 Requirement](https://tradingview.github.io/lightweight-charts/docs#requirements): es2016 language specification
