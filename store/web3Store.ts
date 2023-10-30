import { capitalizeFirst, createSelectors } from '@/lib/utils';
import { createWithEqualityFn } from 'zustand/traditional'
import { immer } from 'zustand/middleware/immer'
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { checkNftStatus, contractsJSONdup, ethersInit, getBalanceEth, nftSalesStatus, nftStatusesDefault, nftStatusesT } from '@/lib/actions/ethers';

export const web3InitDefault = { err: '', warn: '', chainId: '', chainName: '', account: '' };

export type Web3InitOutT = typeof web3InitDefault;
const initialState = {
  ...web3InitDefault,
  nftStatuses: [] as nftSalesStatus[],
  chainType: '',
  isInitialized: false,
  isLoadingWeb3: false,
  err: '',
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

export const initializeWallet = async (chainType = 'evm') => {
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
    console.warn(funcName + '() failed: Unknown chainType', chainType);
  }
  //const out = await getBalanceEth(initOut.account!)
  useWeb3Store.setState((state) => ({
    ...state,
    chainType,
    isInitialized: true,
    chainName: capitalizeFirst(initOut.chainName),
    chainId: initOut.chainId,
    account: initOut.account,
    isLoadingWeb3: false,
  }));
  return initOut;
}

export const updateNftStatus = async (chainType = 'evm', account: string, nftOriginalOwner: string, nftAddr: string, salesAddr: string, nftIdMin = 0, nftIdMax = 9) => {
  const funcName = 'updateNftStatus';
  useWeb3Store.setState((state) => ({
    isLoadingWeb3: true,
  }));
  let out = nftStatusesDefault;
  if (chainType === 'evm') {
    out = await checkNftStatus(account, nftOriginalOwner, nftAddr, salesAddr, nftIdMin, nftIdMax);
    //console.log("statuses:", out)

  } else if (chainType === 'radix') {

  } else {
    console.warn(funcName + '() failed: Unknown chainType', chainType);
  }
  useWeb3Store.setState((state) => ({
    ...state,
    nftStatuses: out.arr,
    isLoadingWeb3: false,
  }));
  return out;
}

/*without immer
  addObjNum1: (by: number) => set((state) => ({
    obj: {
      ...state.obj, num1: state.obj.num1 + by
    }
  })), */