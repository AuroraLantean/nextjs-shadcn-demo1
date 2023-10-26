import { ethers, formatEther, formatUnits, parseUnits, Contract, getBigInt, toNumber } from "ethers";
//import goldcoin from "@/web3ABIs/ethereum/goldcoin.json"
//import dragonNft from "@/web3ABIs/ethereum/erc721Dragon.json";
import contractsJSON from "@/web3ABIs/ethereum/contractABIsERC721Sales.json";
export const contractsJSONdup = contractsJSON;
const tokenJSON = contractsJSON[0];
const nftJSON = contractsJSON[1];
const salesJSON = contractsJSON[2];

import { isEmpty } from "@/lib/utils";
import { Web3InitOutT } from "@/store/web3Store";
import { log } from "console";

let signer: any = undefined;
let provider: any = undefined;
let isInitialized = false;
const lg = console.log;
let mesg = '';
export const bigIntZero = BigInt(0)

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
    //import { InfuraProvider } from "ethers"

    // It also provides an opportunity to request access to write operations, which will be performed by the private key that MetaMask manages for the user.
    signer = await provider.getSigner();

    //https://docs.metamask.io/wallet/get-started/set-up-dev-environment/
    const chainId = await window.ethereum.request({ method: 'eth_chainId' }).catch((err: any) => {
      mesg = '@eth_chainId:' + err;
      console.error(mesg);
      return { err: mesg };
    });
    lg('detected chainId:', chainId);
    const { chainHex, chainName } = getChainObj(chainId)

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
    lg("ethersInit ran successfully")
    return {
      chainId,
      chainName,
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
  const funcName = 'getBalanceEth';
  lg(funcName + '()... addr:', addr);
  if (isEmpty(addr)) {
    return { ...out, err: funcName + ' input invalid' };
  } else if (!provider) {
    return { ...out, err: 'provider invalid' };
  }
  try {
    const balanceInWei: bigint = await provider.getBalance(addr);// 182334002436162568n

    const balanceInEth = formatEther(balanceInWei);
    // '0.182334002436162568'
    lg('success:', balanceInWei, balanceInEth);
    return {
      ...out,
      str1: balanceInEth,
      inWei: balanceInWei,
    };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}

type CTRT = 'usdt' | 'erc721Dragon' | 'erc721Sales';
export const getCtrtAddr = (ctrtName: CTRT): string => {
  let ctrtAddr = '';
  if (contractsJSON.length < 3) {
    console.error("'Error contractsJSON.length < 3'")
    return 'Error contractsJSON.length < 3'
  }
  switch (ctrtName) {
    /*     case 'goldCoin':
          ctrtAddr = tokenJSON.address;
          break;
        case 'erc721Dragon':
          ctrtAddr = nftJSON.address;
          break; */
    case 'usdt':
      ctrtAddr = contractsJSON[0].contractAddress;
      break;
    case 'erc721Dragon':
      ctrtAddr = contractsJSON[1].contractAddress;
      break;
    case 'erc721Sales':
      ctrtAddr = contractsJSON[2].contractAddress;
      break;
  }
  //lg('getCtrtAddr()... ctrtAddr', ctrtAddr);
  return ctrtAddr;
};

export const erc20BalanceOf = async (addrTarget: string, ctrtAddr: string): Promise<OutT> => {
  const funcName = "erc20BalanceOf";
  lg(funcName + '()... addrTarget:', addrTarget, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTarget) || isEmpty(ctrtAddr)) {
    return { ...out, err: funcName + ' input invalid' };
  } else if (!provider) {
    return { ...out, err: 'provider invalid' };
  }
  try {
    const token = new Contract(ctrtAddr, tokenJSON.abi, provider);
    const out = await token.getData(addrTarget);
    lg("getData out:", out);
    const { 0: sym, 1: decimals, 2: tokenBalcInWei } = out;
    //const sym = out.0;
    //const decimals = out.1;// 18n
    //const tokenBalcInWei: bigint = out.2;
    const tokenBalc = formatUnits(tokenBalcInWei, decimals);
    lg('success:', sym, decimals, tokenBalcInWei, tokenBalc);
    return { ...out, str1: tokenBalc, inWei: tokenBalcInWei };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}

export const erc20Allowance = async (addrFrom: string, addrTo: string, ctrtAddr: string): Promise<OutT> => {
  const funcName = 'erc20Allowance';
  lg(funcName + '()... addrFrom:', addrFrom, ', addrTo:', addrTo);
  if (isEmpty(addrFrom) || isEmpty(addrTo) || isEmpty(ctrtAddr)) {
    return { ...out, err: funcName + ' input invalid' };
  } else if (!provider) {
    return { ...out, err: 'provider invalid' };
  }
  try {
    const token = new Contract(ctrtAddr, tokenJSON.abi, provider);

    const allowanceInWei: bigint = await token.allowance(addrFrom, addrTo);
    const decimals = await token.decimals();// 18n
    const allowanceInEth = formatUnits(allowanceInWei, decimals);

    lg('success,', allowanceInWei, allowanceInEth);
    return { ...out, str1: allowanceInEth, inWei: allowanceInWei };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}

export const erc20Transfer = async (addrTo: string, amount: string, ctrtAddr: string): Promise<OutT> => {
  const funcName = 'erc20Transfer';
  lg(funcName + '()... addrTo:', addrTo, ', amount:', amount, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTo) || isEmpty(amount) || isEmpty(ctrtAddr)) {
    return { ...out, err: funcName + ' input invalid' };
  } else if (!signer) {
    return { ...out, err: 'signer invalid' };
  }
  try {
    const token = new Contract(ctrtAddr, tokenJSON.abi, signer);
    const amountInWei = parseUnits(amount, 18);
    const tx = await token.transfer(addrTo, amountInWei);
    const receipt = await tx.wait();
    lg('success... txnHash:', receipt, receipt.hash);
    //receipt has properties of provider, to, from, index: number, blockHash, blockNumber: number, logsBloom, cumulativeGasUsed: bigint, gasPrice: bigint, gasUsed: bigint
    return { ...out, str1: receipt.hash };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}

export const erc20Approve = async (addrTo: string, amount: string, ctrtAddr: string): Promise<OutT> => {
  const funcName = 'erc20Approve';
  lg(funcName + '()... addrTo:', addrTo, ', amount:', amount, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTo) || isEmpty(amount) || isEmpty(ctrtAddr)) {
    return { ...out, err: funcName + ' input invalid' };
  } else if (!signer) {
    return { ...out, err: 'signer invalid' };
  }
  try {
    const token = new Contract(ctrtAddr, tokenJSON.abi, signer);
    const amountInWei = parseUnits(amount, 18);
    const tx = await token.transfer(addrTo, amountInWei);
    const receipt = await tx.wait();
    lg('success... txnHash:', receipt, receipt.hash);
    //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
    return { ...out, str1: receipt.hash };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}

//----------------== ERC721
export const erc721Transfer = async (addrFrom: string, addrTo: string, tokenId: string, ctrtAddr: string): Promise<OutT> => {
  const funcName = 'erc721Transfer'
  lg(funcName + '()... addrFrom:', addrFrom, ', addrTo:', addrTo, ', tokenId:', tokenId, ', ctrtAddr:', ctrtAddr);
  const tokId = Number.parseInt(tokenId);
  if (isEmpty(addrFrom) || isEmpty(addrTo) || isEmpty(tokenId) || isEmpty(ctrtAddr) || Number.isNaN(tokId)) {
    return { ...out, err: funcName + ' input invalid' };
  } else if (!signer) {
    return { ...out, err: 'signer invalid' };
  }
  try {
    const nft = new Contract(ctrtAddr, nftJSON.abi, signer);
    const ownerOut = await nft.ownerOf(tokId);
    lg("ownerOut:", ownerOut)
    if (ownerOut !== addrFrom) console.warn("addrFrom is not the owner")

    const tx = await nft.safeTransferFrom(addrFrom, addrTo, tokId);
    const receipt = await tx.wait();
    lg('success... txnHash:', receipt, receipt.hash);
    //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
    return { ...out, str1: receipt.hash };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}

export const erc721SafeMint = async (addrFrom: string, addrTo: string, tokenId: string, ctrtAddr: string): Promise<OutT> => {
  const funcName = "erc721SafeMint";
  lg(funcName + '()... addrFrom:', addrFrom, ', addrTo:', addrTo, ', tokenId:', tokenId, ', ctrtAddr:', ctrtAddr);
  const tokId = Number.parseInt(tokenId);
  if (isEmpty(addrFrom) || isEmpty(addrTo) || isEmpty(tokenId) || isEmpty(ctrtAddr) || Number.isNaN(tokId)) {
    return { ...out, err: funcName + 'input invalid' };
  } else if (!signer) {
    return { ...out, err: 'signer invalid' };
  }
  try {
    const nft = new Contract(ctrtAddr, nftJSON.abi, signer);

    const ownerOut = await nft.owner();
    lg("ownerOut:", ownerOut)
    if (ownerOut.toLowerCase() !== addrFrom.toLowerCase()) return { ...out, err: 'invalid contract owner' }

    const isExisting: boolean = await nft.exists(tokId);
    lg("isExisting:", isExisting)
    if (isExisting) return { ...out, err: 'tokenId was already minted' }

    const tx = await nft.safeMint(addrTo, tokId);
    const receipt = await tx.wait();
    lg('success... txnHash:', receipt, receipt.hash);
    //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
    return { ...out, str1: receipt.hash };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}

export const erc721BalanceOf = async (addrTarget: string, ctrtAddr: string): Promise<OutT> => {
  const funcName = 'erc721BalanceOf'
  lg(funcName + '()... addrTarget:', addrTarget, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTarget) || isEmpty(ctrtAddr)) {
    return { ...out, err: funcName + ' input invalid' };
  } else if (!provider) {
    return { ...out, err: 'provider invalid' };
  }
  try {
    const nft = new Contract(ctrtAddr, nftJSON.abi, provider);
    const tokenBalcInWei: bigint = await nft.balanceOf(addrTarget);
    lg('success,', tokenBalcInWei);
    return { ...out, inWei: tokenBalcInWei, str1: ethers.toNumber(tokenBalcInWei) + '' };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}

export const erc721OwnerOf = async (tokenId: string, ctrtAddr: string): Promise<OutT> => {
  const funcName = 'erc721OwnerOf'
  lg(funcName + '()... tokenId:', tokenId, ', ctrtAddr:', ctrtAddr, ', tokenId:', tokenId);
  if (isEmpty(tokenId) || isEmpty(ctrtAddr)) {
    return { ...out, err: funcName + ' input invalid' };
  } else if (!provider) {
    return { ...out, err: 'provider invalid' };
  }
  try {
    const nft = new Contract(ctrtAddr, nftJSON.abi, provider);
    const owner: string = await nft.ownerOf(tokenId);
    lg('success,', owner);
    return { ...out, str1: owner };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}

export const erc721TokenIds = async (addrTarget: string, ctrtAddr: string): Promise<OutT> => {
  const funcName = 'erc721TokenIds';
  lg(funcName + '()... addrTarget:', addrTarget, ', ctrtAddr:', ctrtAddr);
  if (isEmpty(addrTarget) || isEmpty(ctrtAddr)) {
    return { ...out, err: funcName + ' input invalid' };
  } else if (!provider) {
    return { ...out, err: 'provider invalid' };
  }
  try {
    const nft = new Contract(ctrtAddr, nftJSON.abi, provider);

    const balc: bigint = await nft.balanceOf(addrTarget);
    lg('balanceOf:', balc);

    const arr = [];
    for (let i = 0; i < toNumber(balc); i++) {
      const tokId: bigint = await nft.tokenOfOwnerByIndex(addrTarget, i);
      arr.push(toNumber(tokId));
      lg('i:', i, ', tokId:', tokId);
    }//tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);
    return { ...out, str1: arr.toString() || "none", nums: arr };
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...out, err: funcName + ' failed' };
  }
}
//----------------==
export const balancesDefault = {
  accBalcNative: '', accBalcToken: '', accBalcNFT: '', accNftArray: [] as number[], salesCtrt: '', salesBalcNative: '', salesBalcToken: '', salesBalcNFT: '', salesNftArray: [] as number[], err: '',
};
export type balancesT = typeof balancesDefault;
export const getBalances = async (account: string, tokenAddr: string, nftAddr: string, salesAddr: string) => {
  const funcName = 'getBalances';
  lg(funcName + ' in ethers.ts...');
  try {
    lg("a100, ctrtAddr:", salesJSON.contractAddress)
    const oAccNative = await getBalanceEth(account)
    const oAccUSDT = await erc20BalanceOf(account, tokenJSON.contractAddress);
    const oAccDragonNFT = await erc721BalanceOf(account, nftJSON.contractAddress);
    const oSalesNative = await getBalanceEth(salesAddr)
    const oSalesUSDT = await erc20BalanceOf(salesAddr, tokenAddr);
    const oSalesNDragonNFT = await erc721BalanceOf(salesAddr, nftAddr);

    let err = ''
    if (oAccNative.err || oAccUSDT.err || oAccDragonNFT.err || oSalesNative.err || oSalesUSDT.err || oSalesNDragonNFT.err) err = oAccNative.err + ", " + oAccUSDT.err + ", " + oAccDragonNFT.err + ", " + oSalesNative.err + ", " + oSalesUSDT.err + ", " + oSalesNDragonNFT.err;

    const sales = new Contract(salesJSON.contractAddress, salesJSON.abi, provider);
    lg("a101")
    const priceInWeiETH: bigint[] = await sales.priceInWeiETH();
    lg("a102. priceInWeiETH:", priceInWeiETH)
    lg("a103")
    const out = {
      ...balancesDefault,
      accBalcNative: oAccNative.str1, accBalcToken: oAccUSDT.str1, accBalcNFT: oAccDragonNFT.str1, salesBalcNative: oSalesNative.str1, salesBalcToken: oSalesUSDT.str1, salesBalcNFT: oSalesNDragonNFT.str1, err,
    }
    //const out: string[] = await sales.getBalances();
    lg("getBalances out:", out)
    return out;
    /*const dp: string = out[6];
      return {
      ...balancesDefault,
      accBalcNative: formatEther(out[0]), accBalcToken: formatUnits(out[1], dp), accBalcNFT: formatUnits(out[2], 18), salesBalcNative: formatEther(out[3]), salesBalcToken: formatUnits(out[4], dp), salesBalcNFT: formatUnits(out[5], 18),
    } */
  } catch (error) {
    console.error(funcName + ':', error);
    return { ...balancesDefault, err: funcName + ' failed' };
  }
}

export const getChainObj = (input: string) => {
  console.log('getChainObj()... input:', input);
  let chainHex;
  let chainName = '';
  switch (input) {
    case 'ethereum':
    case '0x1':
      chainHex = '0x1';
      chainName = 'ethereum';
      break;
    case 'sepolia':
    case '0xaa36a7':
      chainHex = '0xaa36a7';
      chainName = 'sepolia';
      break;
    case 'goerli':
    case '0x5':
      chainHex = '0x5';
      chainName = 'goerli';
      break;
    case 'polygon':
    case '0x89':
      chainHex = '0x89';
      chainName = 'polygon';
      break;
    case 'mumbai':
    case '0x13881':
      chainHex = '0x13881';
      chainName = 'mumbai';
      break;
    case 'bsc':
    case '0x38':
      chainHex = '0x38';
      chainName = 'bsc';
      break;
    case 'bsc_testnet':
    case '0x61':
      chainHex = '0x61';
      chainName = 'bsc_testnet';
      break;
    case 'avalanche':
    case '0xa86a':
      chainHex = '0xa86a';
      chainName = 'avalanche';
      break;
    case 'fantom':
    case '0xfa':
      chainHex = '0xfa';
      chainName = 'fantom';
      break;
    case 'cronos':
    case '0x19':
      chainHex = '0x19';
      chainName = 'cronos';
      break;
    case 'palm':
    case '0x2a15c308d':
      chainHex = '0x2a15c308d';
      chainName = 'palm';
      break;
    case 'arbitrum':
    case '0xa4b1':
      chainHex = '0xa4b1';
      chainName = 'arbitrum';
      break;
    case 'anvil':
    case '0x7a69':
      chainHex = '';
      chainName = 'anvil';
      break;
    case 'hardhat':
    case '0x539':
      chainHex = '';
      chainName = 'hardhat';
      break;
    default:
      chainHex = 'invalid';
      chainName = 'invalid';
  }
  return { chainHex, chainName };
}