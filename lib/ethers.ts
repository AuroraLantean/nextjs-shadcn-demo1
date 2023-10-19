import { ethers, formatEther, formatUnits, parseUnits, Contract, getBigInt } from "ethers";
import goldcoin from "@/web3ABIs/ethereum/goldcoin.json"
import dragonNft from "@/web3ABIs/ethereum/erc721Dragon.json";
import { isEmpty } from "@/lib/utils";

let signer: any;
let provider: any;
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
type ReadBalcInT = {
  addrTarget: string
  addrCtrt: string
}
export type OutT = {
  err: string
  inEth: string
  inWei: bigint
  txnHash: string
}
export let out: OutT = { err: '', inEth: '', inWei: bigIntZero, txnHash: '' }

// type OutT = {
//   err: string
//   txnHash: string
// }
//let txnOut: OutT = { err: '', txnHash: '' }
export type TxnInT = {
  chainName: string
  ctrtAddr: string
  addr1: string
  addr2: string
  amount1: string
  amount2: string
}
export let txnIn: TxnInT = { chainName: '', ctrtAddr: '', addr1: '', addr2: '', amount1: '', amount2: '' };

type Contact = {
  id: string
  name: string
  email: string
  company: string
  job: string
}
type BcResult = {
  error: string
  data: any
  txn: any
}
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
  const balanceInWei: bigint = await provider.getBalance(addr)
  // 182334002436162568n

  const balanceInEth = formatEther(balanceInWei);
  // '0.182334002436162568'
  lg('success:', balanceInWei, balanceInEth);
  return {
    ...out,
    inEth: balanceInEth,
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

export const erc20BalanceOf = async (input: ReadBalcInT): Promise<OutT> => {
  const userAddr = input.addrTarget;
  lg('erc20BalanceOf()... userAddr:', userAddr);
  if (isEmpty(userAddr) || isEmpty(input.addrCtrt)) {
    return { ...out, err: 'input invalid' };
  }
  const goldcoinInst = new Contract(input.addrCtrt, goldcoin.abi, provider);

  const sym = await goldcoinInst.symbol();
  const decimals = await goldcoinInst.decimals();// 18n
  const tokenBalcInWei: bigint = await goldcoinInst.balanceOf(userAddr);
  const tokenBalc = formatUnits(tokenBalcInWei, decimals);

  lg('success:', sym, decimals, tokenBalcInWei, tokenBalc);
  return { ...out, inEth: tokenBalc, inWei: tokenBalcInWei };
}

export const erc20Allowance = async (input: TxnInT): Promise<OutT> => {
  const addr1 = input.addr1;
  const addr2 = input.addr2;
  const ctrtAddr = input.ctrtAddr;
  lg('erc20Allowance()... addr1:', addr1, ', addr2:', addr2);
  if (isEmpty(addr1) || isEmpty(addr2) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const goldcoinInst = new Contract(ctrtAddr, goldcoin.abi, provider);

  const allowanceInWei: bigint = await goldcoinInst.allowance(addr1, addr2);
  const decimals = await goldcoinInst.decimals();// 18n
  const allowanceInEth = formatUnits(allowanceInWei, decimals);

  lg('success,', allowanceInWei, allowanceInEth);
  return { ...out, inEth: allowanceInEth, inWei: allowanceInWei };
}

export const erc20Transfer = async (input: TxnInT): Promise<OutT> => {
  const addrTo = input.addr2;
  const amt = input.amount1;
  const ctrtAddr = input.ctrtAddr;
  lg('erc20Transfer()... addrTo:', addrTo, ', amt:', amt, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTo) || isEmpty(amt) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const goldcoinInst = new Contract(ctrtAddr, goldcoin.abi, signer);
  const amountInWei = parseUnits(amt, 18);
  const tx = await goldcoinInst.transfer(addrTo, amountInWei);
  const receipt = await tx.wait();
  lg('success... txnHash:', receipt, receipt.hash);
  //receipt has properties of provider, to, from, index: number, blockHash, blockNumber: number, logsBloom, cumulativeGasUsed: bigint, gasPrice: bigint, gasUsed: bigint
  return { ...out, txnHash: receipt.hash };
}

export const erc20Approve = async (input: TxnInT): Promise<OutT> => {
  const addr2 = input.addr2;
  const amt = input.amount1;
  const ctrtAddr = input.ctrtAddr;
  lg('erc20Approve()... addr2:', addr2, ', amt:', amt, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addr2) || isEmpty(amt) || isEmpty(ctrtAddr)) {
    return { ...out, err: 'input invalid' };
  }
  const goldcoinInst = new Contract(ctrtAddr, goldcoin.abi, signer);
  const amountInWei = parseUnits(amt, 18);
  const tx = await goldcoinInst.transfer(addr2, amountInWei);
  const receipt = await tx.wait();
  lg('success... txnHash:', receipt, receipt.hash);
  //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
  return { ...out, txnHash: receipt.hash };
}

//----------------== ERC721
export const erc721Transfer = async (input: TxnInT): Promise<OutT> => {
  const addr1 = input.addr1;
  const addr2 = input.addr2;
  const tokenId = input.amount1;
  const ctrtAddr = input.ctrtAddr;
  lg('erc20Allowance()... addr1:', addr1, ', addr2:', addr2, ', tokenId:', tokenId, ', ctrtAddr:', ctrtAddr);
  const tokId = Number.parseInt(tokenId);
  if (isEmpty(addr1) || isEmpty(addr2) || isEmpty(tokenId) || isEmpty(ctrtAddr) || Number.isNaN(tokId)) {
    return { ...out, err: 'input invalid' };
  }
  try {
    const dragonNftInst = new Contract(ctrtAddr, dragonNft.abi, signer);
    const sym = await dragonNftInst.name();
    lg('symbol', sym);
    if (sym !== 'Dragons') {
      return { ...out, err: 'invalid contract' };
    }
    const tx = await dragonNftInst.safeTransferFrom(addr1, addr2, tokenId);
    const receipt = await tx.wait();
    lg('success... txnHash:', receipt, receipt.hash);
    //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
    return { ...out, txnHash: receipt.hash };
  } catch (error) {
    console.error('@erc721Transfer:', error);
    return { ...out, err: 'invocation failed' };
  }

}

export const erc721BalanceOf = async (input: ReadBalcInT): Promise<OutT> => {
  const userAddr = input.addrTarget;
  lg('erc20BalanceOf()... userAddr:', userAddr);
  if (isEmpty(userAddr) || isEmpty(input.addrCtrt)) {
    return { ...out, err: 'input invalid' };
  }
  const dragonNftInst = new Contract(input.addrCtrt, dragonNft.abi, provider);
  const sym = await dragonNftInst.name();
  lg('symbol', sym);
  if (sym !== 'Dragons') {
    return { ...out, err: 'not Dragons contract' };
  }
  const tokenBalcInWei: bigint = await dragonNftInst.balanceOf(userAddr);
  lg('success,', tokenBalcInWei);
  return { ...out, inWei: tokenBalcInWei, inEth: ethers.toNumber(tokenBalcInWei) + '' };
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