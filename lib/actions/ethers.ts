import { ethers, formatEther, formatUnits, parseUnits, Contract, getBigInt, toNumber } from "ethers";
import goldcoin from "@/web3ABIs/ethereum/goldcoin.json"
import dragonNft from "@/web3ABIs/ethereum/erc721Dragon.json";
import { isEmpty } from "@/lib/utils";

let signer: any;//TODO: store this in a client state
let provider: any;//TODO: store this in a client state
let isInitialized = false;
const lg = console.log;
let mesg = '';
export const bigIntZero = getBigInt(0)

type Web3InitOutT = {
  err: string
  warn: string
  chainId: string
  account: string
}
export type OutT = {
  err: string
  str1: string
  inWei: bigint
  nums: number[]
}
export let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] }
declare global {
  interface Window {
    ethereum: any
  }
}
export const ethersInit = async (): Promise<Partial<Web3InitOutT>> => {
  lg("ethersInit()...");
  if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider, which is backed by a variety of third-party services (such as INFURA). They do not have private keys installed so are only have read-only access
    mesg = "MetaMask not installed; using read-only defaults";
    console.warn(mesg)
    provider = ethers.getDefaultProvider("sepolia");
    return {
      warn: mesg,
    };
  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard protocol that allows Ethers access to make all read-only requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum)

    // It also provides an opportunity to request access to write operations, which will be performed by the private key that MetaMask manages for the user.
    signer = await provider.getSigner();

    //https://docs.metamask.io/wallet/get-started/set-up-dev-environment/
    const chainId = await window.ethereum.request({ method: 'eth_chainId' }).catch((err: any) => {
      mesg = '@eth_chainId:' + err;
      console.error(mesg);
      return { err: mesg };
    });
    lg('detected chainId:', chainId);

    const accounts = await window.ethereum.request({ method: 'eth_accounts' }).catch((err: any) => {
      mesg = '@eth_accounts:' + err;
      console.error(mesg);
      return { err: mesg };
    });
    lg('detected accounts:', accounts);//same as account with only one item in the array
    const out = handleAccountsChanged(accounts);
    if (out.warn) {
      return { warn: out.warn }
    }
    const account = out.account;
    lg('detected account:', account);

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return {
      chainId,
      account,
    };
  }
}
const handleChainChanged = () => {
  window.location.reload();
}
function handleAccountsChanged(accounts: string | any[]): Partial<Web3InitOutT> {
  let currentAccount = null;
  if (accounts.length === 0) {
    mesg = 'Please connect to MetaMask';
    console.warn(mesg);
    return { warn: mesg };
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    lg('currentAccount', currentAccount);
    if (isInitialized) {
      window.location.reload();
    }
    isInitialized = true;
  }
  return { account: currentAccount };
}

export async function getAccount(): Promise<Partial<Web3InitOutT>> {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((err: any) => {
      if (err.code === 4001) {
        mesg = 'Please connect to MetaMask';
        console.warn(mesg);
        return { warn: mesg };
      } else {
        console.error(err);
        return { err };
      }
    });
  const account = accounts[0];
  lg('getAccount() success. account:', account);
  return { account };
}

export const getBalanceEth = async (addr: string): Promise<OutT> => {
  lg('getBalanceEth()... addr:', addr);
  if (isEmpty(addr)) {
    return { ...out, err: 'input invalid' };
  }
  const balanceInWei: bigint = await provider.getBalance(addr);// 182334002436162568n

  const balanceInEth = formatEther(balanceInWei);
  // '0.182334002436162568'
  lg('success:', balanceInWei, balanceInEth);
  return {
    ...out,
    str1: balanceInEth,
    inWei: balanceInWei,
  };
}

export const getCtrtAddr = (ctrtName: string): string => {
  let ctrtAddr = '';
  switch (ctrtName) {
    case 'goldCoin':
      ctrtAddr = goldcoin.address;
      break;
    case 'erc721Dragon':
      ctrtAddr = dragonNft.address;
      break;
  }
  lg('getCtrtAddr()... ctrtAddr', ctrtAddr);
  return ctrtAddr;
};

export const erc20BalanceOf = async (addrTarget: string, ctrtAddr: string): Promise<OutT> => {
  lg('erc20BalanceOf()... addrTarget:', addrTarget, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTarget) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const goldcoinInst = new Contract(ctrtAddr, goldcoin.abi, provider);

  const sym = await goldcoinInst.symbol();
  const decimals = await goldcoinInst.decimals();// 18n
  const tokenBalcInWei: bigint = await goldcoinInst.balanceOf(addrTarget);
  const tokenBalc = formatUnits(tokenBalcInWei, decimals);

  lg('success:', sym, decimals, tokenBalcInWei, tokenBalc);
  return { ...out, str1: tokenBalc, inWei: tokenBalcInWei };
}

export const erc20Allowance = async (addrFrom: string, addrTo: string, ctrtAddr: string): Promise<OutT> => {
  lg('erc20Allowance()... addrFrom:', addrFrom, ', addrTo:', addrTo);
  if (isEmpty(addrFrom) || isEmpty(addrTo) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const goldcoinInst = new Contract(ctrtAddr, goldcoin.abi, provider);

  const allowanceInWei: bigint = await goldcoinInst.allowance(addrFrom, addrTo);
  const decimals = await goldcoinInst.decimals();// 18n
  const allowanceInEth = formatUnits(allowanceInWei, decimals);

  lg('success,', allowanceInWei, allowanceInEth);
  return { ...out, str1: allowanceInEth, inWei: allowanceInWei };
}

export const erc20Transfer = async (addrTo: string, amount: string, ctrtAddr: string): Promise<OutT> => {
  lg('erc20Transfer()... addrTo:', addrTo, ', amount:', amount, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTo) || isEmpty(amount) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const goldcoinInst = new Contract(ctrtAddr, goldcoin.abi, signer);
  const amountInWei = parseUnits(amount, 18);
  const tx = await goldcoinInst.transfer(addrTo, amountInWei);
  const receipt = await tx.wait();
  lg('success... txnHash:', receipt, receipt.hash);
  //receipt has properties of provider, to, from, index: number, blockHash, blockNumber: number, logsBloom, cumulativeGasUsed: bigint, gasPrice: bigint, gasUsed: bigint
  return { ...out, str1: receipt.hash };
}

export const erc20Approve = async (addrTo: string, amount: string, ctrtAddr: string): Promise<OutT> => {
  lg('erc20Approve()... addrTo:', addrTo, ', amount:', amount, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTo) || isEmpty(amount) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const goldcoinInst = new Contract(ctrtAddr, goldcoin.abi, signer);
  const amountInWei = parseUnits(amount, 18);
  const tx = await goldcoinInst.transfer(addrTo, amountInWei);
  const receipt = await tx.wait();
  lg('success... txnHash:', receipt, receipt.hash);
  //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
  return { ...out, str1: receipt.hash };
}

//----------------== ERC721
export const erc721Transfer = async (addrFrom: string, addrTo: string, tokenId: string, ctrtAddr: string): Promise<OutT> => {
  lg('erc20Allowance()... addrFrom:', addrFrom, ', addrTo:', addrTo, ', tokenId:', tokenId, ', ctrtAddr:', ctrtAddr);
  const tokId = Number.parseInt(tokenId);
  if (isEmpty(addrFrom) || isEmpty(addrTo) || isEmpty(tokenId) || isEmpty(ctrtAddr) || Number.isNaN(tokId)) {
    return { ...out, err: 'input invalid' };
  }
  try {
    const dragonNftInst = new Contract(ctrtAddr, dragonNft.abi, signer);
    const sym = await dragonNftInst.name();
    lg('symbol', sym);
    if (sym !== 'Dragons') {
      return { ...out, err: 'invalid contract' };
    }
    const ownerOut = await dragonNftInst.ownerOf(tokId);
    lg("ownerOut:", ownerOut)
    if (ownerOut !== addrFrom) console.warn("addrFrom is not the owner")

    const tx = await dragonNftInst.safeTransferFrom(addrFrom, addrTo, tokId);
    const receipt = await tx.wait();
    lg('success... txnHash:', receipt, receipt.hash);
    //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
    return { ...out, str1: receipt.hash };
  } catch (error) {
    console.error('@erc721Transfer:', error);
    return { ...out, err: 'invocation failed' };
  }
}

export const erc721SafeMint = async (addrFrom: string, addrTo: string, tokenId: string, ctrtAddr: string): Promise<OutT> => {
  lg('erc721SafeMint()... addrFrom:', addrFrom, ', addrTo:', addrTo, ', tokenId:', tokenId, ', ctrtAddr:', ctrtAddr);
  const tokId = Number.parseInt(tokenId);
  if (isEmpty(addrFrom) || isEmpty(addrTo) || isEmpty(tokenId) || isEmpty(ctrtAddr) || Number.isNaN(tokId))
    return { ...out, err: 'input invalid' };

  try {
    const dragonNftInst = new Contract(ctrtAddr, dragonNft.abi, signer);
    const sym = await dragonNftInst.name();
    lg('symbol', sym);
    if (sym !== 'Dragons') return { ...out, err: 'invalid contract' };

    const ownerOut = await dragonNftInst.owner();
    lg("ownerOut:", ownerOut)
    if (ownerOut.toLowerCase() !== addrFrom.toLowerCase()) return { ...out, err: 'invalid contract owner' }

    const isExisting: boolean = await dragonNftInst.exists(tokId);
    lg("isExisting:", isExisting)
    if (isExisting) return { ...out, err: 'tokenId was already minted' }

    const tx = await dragonNftInst.safeMint(addrTo, tokId);
    const receipt = await tx.wait();
    lg('success... txnHash:', receipt, receipt.hash);
    //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
    return { ...out, str1: receipt.hash };
  } catch (error) {
    console.error('@erc721SafeMint:', error);
    return { ...out, err: 'invocation failed' };
  }
}

export const erc721BalanceOf = async (addrTarget: string, ctrtAddr: string): Promise<OutT> => {
  lg('erc20BalanceOf()... addrTarget:', addrTarget, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTarget) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const dragonNftInst = new Contract(ctrtAddr, dragonNft.abi, provider);
  const sym = await dragonNftInst.name();
  lg('symbol', sym);
  if (sym !== 'Dragons') {
    return { ...out, err: 'not Dragons contract' };
  }
  const tokenBalcInWei: bigint = await dragonNftInst.balanceOf(addrTarget);
  lg('success,', tokenBalcInWei);
  return { ...out, inWei: tokenBalcInWei, str1: ethers.toNumber(tokenBalcInWei) + '' };
}

export const ownerOf = async (tokenId: string, ctrtAddr: string): Promise<OutT> => {
  lg('ownerOf()... tokenId:', tokenId, ', ctrtAddr:', ctrtAddr, ', tokenId:', tokenId);
  if (isEmpty(tokenId) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const dragonNftInst = new Contract(ctrtAddr, dragonNft.abi, provider);
  const sym = await dragonNftInst.name();
  lg('symbol', sym);
  if (sym !== 'Dragons') {
    return { ...out, err: 'not Dragons contract' };
  }
  const owner: string = await dragonNftInst.ownerOf(tokenId);
  lg('success,', owner);
  return { ...out, str1: owner };
}

export const erc721TokenIds = async (addrTarget: string, ctrtAddr: string): Promise<OutT> => {
  lg('erc721TokenIds()... addrTarget:', addrTarget, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTarget) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const dragonNftInst = new Contract(ctrtAddr, dragonNft.abi, provider);
  const sym = await dragonNftInst.name();
  lg('symbol', sym);
  if (sym !== 'Dragons') {
    return { ...out, err: 'not Dragons contract' };
  }
  const balc: bigint = await dragonNftInst.balanceOf(addrTarget);
  lg('balanceOf:', balc);

  const arr = [];
  for (let i = 0; i < toNumber(balc); i++) {
    const tokId: bigint = await dragonNftInst.tokenOfOwnerByIndex(addrTarget, i);
    arr.push(toNumber(tokId));
    lg('i:', i, ', tokId:', tokId);
  }//tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);
  return { ...out, str1: arr.toString() || "none", nums: arr };
}


export const getChainObj = (input: string) => {
  console.log('getChainObj()... input:', input);
  let chainHex;
  let chainStr = '';
  switch (input) {
    case 'ethereum':
    case '0x1':
      chainHex = '0x1';
      chainStr = 'ethereum';
      break;
    case 'sepolia':
    case '0xaa36a7':
      chainHex = '0xaa36a7';
      chainStr = 'sepolia';
      break;
    case 'goerli':
    case '0x5':
      chainHex = '0x5';
      chainStr = 'goerli';
      break;
    case 'polygon':
    case '0x89':
      chainHex = '0x89';
      chainStr = 'polygon';
      break;
    case 'mumbai':
    case '0x13881':
      chainHex = '0x13881';
      chainStr = 'mumbai';
      break;
    case 'bsc':
    case '0x38':
      chainHex = '0x38';
      chainStr = 'bsc';
      break;
    case 'bsc_testnet':
    case '0x61':
      chainHex = '0x61';
      chainStr = 'bsc_testnet';
      break;
    case 'avalanche':
    case '0xa86a':
      chainHex = '0xa86a';
      chainStr = 'avalanche';
      break;
    case 'fantom':
    case '0xfa':
      chainHex = '0xfa';
      chainStr = 'fantom';
      break;
    case 'cronos':
    case '0x19':
      chainHex = '0x19';
      chainStr = 'cronos';
      break;
    case 'palm':
    case '0x2a15c308d':
      chainHex = '0x2a15c308d';
      chainStr = 'palm';
      break;
    case 'arbitrum':
    case '0xa4b1':
      chainHex = '0xa4b1';
      chainStr = 'arbitrum';
      break;
    default:
      chainHex = 'invalid';
      chainStr = 'invalid';
  }
  return { chainHex, chainStr };
}