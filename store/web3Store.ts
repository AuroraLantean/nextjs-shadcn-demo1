import { capitalizeFirst, createSelectors, isEmpty } from '@/lib/utils';
import { createWithEqualityFn } from 'zustand/traditional'
import { immer } from 'zustand/middleware/immer'
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { contractsJSONdup, initializeEvmWallet, getBalanceEth, getEvmAddr, getEvmBalances, nftSalesStatus, nftStatusesDefault, nftStatusesT, checkEvmNftStatus, erc721BaseURI, OutT, out, evmSalesPrices, ethersDefaultProvider, evmSalesPricesD } from '@/lib/actions/ethers';
import { DragonT, dragons, extractNftIds } from '@/constants/site_data';

export const web3InitDefault = { err: '', warn: '', chainType: '', chainId: '', chainName: '', account: '' };
const lg = console.log;

export type Web3InitOutT = typeof web3InitDefault;
const initialState = {
  ...web3InitDefault, tokenAddr: '', nftAddr: '', salesAddr: '', nftOriginalOwner: '',
  nftStatuses: [] as nftSalesStatus[],
  isInitialized: false, isDefaultProvider: false,
  err: '', baseURI: '', nativeAssetName: '', tokenName: '', tokenSymbol: '',
  accBalcNative: '', accBalcToken: '',
  accNftArray: [] as number[],
  salesBalcNative: '', salesBalcToken: '',
  salesNftArray: [] as number[], priceNativeRaw: '', priceTokenRaw: '', decimals: 18,
  nftArray: [] as DragonT[], nftIds: [] as number[],
  prices: [] as string[],
}
const makeObjSlice: StateCreator<typeof initialState, [
  ["zustand/immer", never],
  ["zustand/devtools", unknown],
  ["zustand/subscribeWithSelector", never]
]> = (set, get) => (initialState);

//Zustand Store can contain primitives, objects, functions. State has to be updated immutably and the set function merges state to help it. immer
export const useWeb3Store = createSelectors(createWithEqualityFn<typeof initialState>()(immer(devtools(subscribeWithSelector(makeObjSlice), {
  enabled: true,
  name: "Web3 store",
}
)
)));

export const initializeDefaultProvider = async (chainType: string) => {
  const funcName = 'initializeDefaultProvider';
  let initOut = web3InitDefault;
  let nativeAssetName = ''
  if (chainType === 'evm') {
    initOut = await ethersDefaultProvider();
    const len = contractsJSONdup.length;
    if (len < 2) return { ...initOut, err: 'contract ABI must be at least 3' }

  } else if (chainType === 'radix') {

  } else {
    return { ...initOut, err: 'Unknown chainType' };
  }
  if (initOut.err) {

  } else {
    //else if (initOut.warn)
    nativeAssetName = getNativeAssetName(chainType)

    useWeb3Store.setState((state) => ({
      ...state,
      isDefaultProvider: true,
      chainType,
      nativeAssetName,
      chainName: capitalizeFirst(initOut.chainName),
      chainId: initOut.chainId,
      account: initOut.account,
    }));
  }
  return initOut;
}
export const initializeWallet = async (chainType: string) => {
  const funcName = 'initializeWallet';
  let initOut = web3InitDefault;
  let nativeAssetName = ''
  if (chainType === 'evm') {
    initOut = await initializeEvmWallet();
    const len = contractsJSONdup.length;
    if (len < 2) return { ...initOut, err: 'contract ABI must be at least 3' }

  } else if (chainType === 'radix') {

  } else {
    return { ...initOut, err: 'Unknown chainType' };
  }
  nativeAssetName = getNativeAssetName(chainType)
  if (initOut.err || initOut.warn) {
    useWeb3Store.setState((state) => ({
      ...state,
      chainType, nativeAssetName,
      chainName: capitalizeFirst(initOut.chainName),
      chainId: initOut.chainId,
      account: initOut.account,
    }));
  } else {
    useWeb3Store.setState((state) => ({
      ...state,
      chainType, nativeAssetName,
      isInitialized: true,
      isDefaultProvider: false,
      chainName: capitalizeFirst(initOut.chainName),
      chainId: initOut.chainId,
      account: initOut.account,
    }));
  }
  return initOut;
}


export const updateNftArray = async (nftIdMin: number, nftIdMax: number) => {
  //get NFT Data from APIs OR from a local file...
  const nftArrayRaw = dragons;
  const nftArray = nftArrayRaw.toSorted((a, b) => a.id - b.id);//nftArray.sort((a, b) => a.id >= b.id ? -1 : 1);
  lg("sorted nftArray", nftArray)

  const nftIds = extractNftIds(nftArray)
  lg('nftIds:', nftIds);
  const distinctIds = [...new Set(nftIds)];
  if (distinctIds.length < nftIds.length) {
    return { err: 'found duplicate NFT ID(s)"', nfts: [], nftIds: [] };
  }
  useWeb3Store.setState((state) => ({
    ...state,
    nftArray,
    nftIds,
  }));
  return { nfts: nftArray, nftIds, err: '' };
}

export const updateNftStatus = async (chainType: string, account: string, nftOriginalOwner: string, nftAddr: string, salesAddr: string, nftIdMin: number, nftIdMax: number) => {
  const funcName = 'updateNftStatus';
  let out = nftStatusesDefault;
  if (chainType === 'evm') {
    out = await checkEvmNftStatus(account, nftOriginalOwner, nftAddr, salesAddr, nftIdMin, nftIdMax);

  } else if (chainType === 'radix') {

  } else {
    return { ...out, err: 'Unknown chainType' };
  }
  if (out.err) {
    return { ...out, err: funcName + ' err:' + out.err, };
  }
  //lg(funcName + " out.arr:", out.arr)
  useWeb3Store.setState((state) => ({
    ...state,
    nftStatuses: out.arr,
  }
  ));
  return out;
}

export const getBaseURI = async (chainType: string, nftAddr: string) => {
  const funcName = 'getBaseURI';
  let out1: OutT = out;
  if (chainType === 'evm') {
    out1 = await erc721BaseURI(nftAddr);

  } else if (chainType === 'radix') {

  } else {
    return { ...out, err: 'Unknown chainType' };
  }
  if (out.err) {
    return { ...out, err: funcName + ' err:' + out.err, };
  }
  //lg(funcName + " out.arr:", out.arr)
  useWeb3Store.setState((state) => ({
    ...state,
    baseURI: out1.str1,
  }
  ));
  return out;
}

export const getSalesPrices = async (chainType: string, tokenIds: number[], nftAddr: string, salesAddr: string) => {
  const funcName = 'getSalesPrices()';
  lg(funcName + " in web3Store.ts... tokenIds:" + tokenIds)
  let out = evmSalesPricesD;
  if (chainType === 'evm') {
    out = await evmSalesPrices(tokenIds, nftAddr, salesAddr);

  } else if (chainType === 'radix') {

  } else {
    return { ...out, err: 'Unknown chainType' };
  }
  if (out.err) {
    return { ...out, err: out.err };
  }
  lg(funcName + " successful. out:", out)
  useWeb3Store.setState((state) => ({
    ...state,
    tokenAddr: out.tokenAddr,
    tokenName: out.name,
    tokenSymbol: out.symbol,
    decimals: out.decimals,
    prices: out.priceArrStr,
  }
  ));
  return out;
}

export const updateAddrs = async (chainType: string) => {
  const funcName = 'updateAddrs';
  let nftAddr = '', salesAddr = '', nftOriginalOwner = '';
  const outDefault = {
    tokenAddr: '', nftAddr: '', salesAddr: '', nftOriginalOwner: ''
  }
  if (chainType === 'evm') {
    //tokenAddr = getEvmAddr('erc20_usdt')
    nftAddr = getEvmAddr('erc721Dragon')
    salesAddr = getEvmAddr('erc721Sales')
    nftOriginalOwner = getEvmAddr('nftOriginalOwner')
    if (isEmpty(nftAddr) || isEmpty(salesAddr) || isEmpty(nftOriginalOwner)) return { ...outDefault, err: 'found empty address' };
  } else if (chainType === 'radix') {

  } else {
    return { ...outDefault, err: 'Unknown chainType' };
  }
  lg(funcName + ', nftAddr:', nftAddr, ', salesAddr:', salesAddr);
  useWeb3Store.setState((state) => ({
    ...state,
    nftAddr, salesAddr, nftOriginalOwner
  }));
  return { nftAddr, salesAddr, nftOriginalOwner, err: '' }
}

export const initBalancesDefault = {
  accBalcNative: '', accBalcToken: '',
  accNftArray: [] as number[],
  salesBalcNative: '', salesBalcToken: '',
  salesNftArray: [] as number[], err: '',
};
export type balancesT = typeof initBalancesDefault;

export const getCurrBalances = async (chainType: string, account: string, tokenAddr: string, nftAddr: string, salesAddr: string) => {
  const funcName = 'getCurrBalances';
  let balcs = initBalancesDefault;

  if (chainType === 'evm') {
    balcs = await getEvmBalances(account, tokenAddr, nftAddr, salesAddr);

  } else if (chainType === 'radix') {

  } else {
    return { ...balcs, err: 'Unknown chainType' };
  }
  lg(funcName + ' from selected chain. err:', balcs.err);
  if (balcs.err) {
    console.error(funcName + " failed:", balcs.err);
  } else {
    useWeb3Store.setState((state) => ({
      ...state,
      ...balcs,
    }));
  }
  return { ...balcs }
}

export const getNativeAssetName = (chainType: string) => {
  let nativeAssetName = '';
  switch (chainType) {
    case 'evm':
      nativeAssetName = 'ETH';
      break;
    case 'radix':
      nativeAssetName = 'XRD';
      break;
    default:
      nativeAssetName = 'Unknown';
  }
  return nativeAssetName;
}
/*without immer
  addObjNum1: (by: number) => set((state) => ({
    obj: {
      ...state.obj, num1: state.obj.num1 + by
    }
  })), */