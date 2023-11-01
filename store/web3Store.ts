import { capitalizeFirst, createSelectors, isEmpty } from '@/lib/utils';
import { createWithEqualityFn } from 'zustand/traditional'
import { immer } from 'zustand/middleware/immer'
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { contractsJSONdup, ethersInit, getBalanceEth, getEvmAddr, getEvmBalances, nftSalesStatus, nftStatusesDefault, nftStatusesT, checkEvmNftStatus } from '@/lib/actions/ethers';
import { DragonT, dragons, extractNftIds } from '@/constants/site_data';

export const web3InitDefault = { err: '', warn: '', chainType: '', chainId: '', chainName: '', account: '' };
const lg = console.log;

export type Web3InitOutT = typeof web3InitDefault;
const initialState = {
  ...web3InitDefault, usdtAddr: '', nftAddr: '', salesAddr: '', nftOriginalOwner: '',
  nftStatuses: [] as nftSalesStatus[],
  isInitialized: false,
  isLoadingWeb3: false,
  err: '',
  accBalcNative: '', accBalcToken: '',
  accNftArray: [] as number[],
  salesBalcNative: '', salesBalcToken: '',
  salesNftArray: [] as number[], priceNativeRaw: '', priceTokenRaw: '', decimals: 18,
  nftArray: [] as DragonT[],
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

export const initializeWallet = async (chainType: string) => {
  const funcName = 'initializeWallet';
  useWeb3Store.setState((state) => ({
    isLoadingWeb3: true,
  }));
  let initOut = web3InitDefault;
  if (chainType === 'evm') {
    initOut = await ethersInit();
    const len = contractsJSONdup.length;
    if (len < 2) return { ...initOut, err: 'contract ABI must be at least 3' }

  } else if (chainType === 'radix') {

  } else {
    return { ...initOut, err: 'Unknown chainType' };
  }
  if (initOut.err || initOut.warn) {
    useWeb3Store.setState((state) => ({
      ...state,
      chainType,
      chainName: capitalizeFirst(initOut.chainName),
      chainId: initOut.chainId,
      account: initOut.account,
      isLoadingWeb3: false,
    }));
  } else {
    useWeb3Store.setState((state) => ({
      ...state,
      chainType,
      isInitialized: true,
      chainName: capitalizeFirst(initOut.chainName),
      chainId: initOut.chainId,
      account: initOut.account,
      isLoadingWeb3: false,
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
    return { err: 'found duplicate NFT ID(s)"', nfts: [], };
  }
  useWeb3Store.setState((state) => ({
    ...state,
    nftArray: nftArray,
  }));
  return { nfts: nftArray, err: '' };
}

export const updateNftStatus = async (chainType: string, account: string, nftOriginalOwner: string, nftAddr: string, salesAddr: string, nftIdMin: number, nftIdMax: number) => {
  const funcName = 'updateNftStatus';
  useWeb3Store.setState((state) => ({
    isLoadingWeb3: true,
  }));

  let out = nftStatusesDefault;
  if (chainType === 'evm') {
    out = await checkEvmNftStatus(account, nftOriginalOwner, nftAddr, salesAddr, nftIdMin, nftIdMax);

  } else if (chainType === 'radix') {

  } else {
    return { ...out, err: 'Unknown chainType' };
  }
  if (out.err) {
    return { ...out, err: 'checkEvmNftStatus err:' + out.err, };
  }
  //lg(funcName + " out.arr:", out.arr)
  useWeb3Store.setState((state) => ({
    ...state,
    nftStatuses: out.arr,
    isLoadingWeb3: false,
  }
  ));
  return out;
}

export const updateAddrs = async (chainType: string) => {
  const funcName = 'updateAddrs';
  let usdtAddr = '', nftAddr = '', salesAddr = '', nftOriginalOwner = '';
  const outDefault = {
    usdtAddr: '', nftAddr: '', salesAddr: '', nftOriginalOwner: ''
  }
  if (chainType === 'evm') {
    usdtAddr = getEvmAddr('erc20_usdt')
    nftAddr = getEvmAddr('erc721Dragon')
    salesAddr = getEvmAddr('erc721Sales')
    nftOriginalOwner = getEvmAddr('nftOriginalOwner')
    if (isEmpty(usdtAddr) || isEmpty(nftAddr) || isEmpty(salesAddr) || isEmpty(nftOriginalOwner)) return { ...outDefault, err: 'found empty address' };
  } else if (chainType === 'radix') {

  } else {
    return { ...outDefault, err: 'Unknown chainType' };
  }
  lg(funcName + '. usdt:', usdtAddr, ', nftAddr:', nftAddr, ', salesAddr:', salesAddr);
  useWeb3Store.setState((state) => ({
    ...state,
    usdtAddr, nftAddr, salesAddr, nftOriginalOwner
  }));
  return { usdtAddr, nftAddr, salesAddr, nftOriginalOwner, err: '' }
}

export const initBalancesDefault = {
  accBalcNative: '', accBalcToken: '',
  accNftArray: [] as number[],
  salesBalcNative: '', salesBalcToken: '',
  salesNftArray: [] as number[], priceNativeRaw: '', priceTokenRaw: '', decimals: 18, err: '',
};
export type balancesT = typeof initBalancesDefault;

export const getCurrBalances = async (chainType: string, account: string, tokenAddr: string, nftAddr: string, salesAddr: string) => {
  const funcName = 'getCurrBalances';
  let balcs = initBalancesDefault;

  useWeb3Store.setState((state) => ({
    isLoadingWeb3: true,
  }));

  if (chainType === 'evm') {
    balcs = await getEvmBalances(account, tokenAddr, nftAddr, salesAddr);

  } else if (chainType === 'radix') {

  } else {
    return { ...balcs, err: 'Unknown chainType' };
  }
  lg(funcName + ' from selected chain. err:', balcs.err);
  if (balcs.err) {
    useWeb3Store.setState((state) => ({
      ...state,
      isLoadingWeb3: false,
    }));
  } else {
    useWeb3Store.setState((state) => ({
      ...state,
      ...balcs,
      isLoadingWeb3: false,
    }));
  }
  return { ...balcs }
}

/*without immer
  addObjNum1: (by: number) => set((state) => ({
    obj: {
      ...state.obj, num1: state.obj.num1 + by
    }
  })), */