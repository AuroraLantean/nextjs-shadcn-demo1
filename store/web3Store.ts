import { capitalizeFirst, createSelectors } from '@/lib/utils';
import { createWithEqualityFn } from 'zustand/traditional'
import { immer } from 'zustand/middleware/immer'
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { contractsJSONdup, ethersInit, getBalanceEth } from '@/lib/actions/ethers';

export const web3InitDefault = { err: '', warn: '', chainId: '', chainName: '', account: '' };

export type Web3InitOutT = typeof web3InitDefault;
const initialState = {
  ...web3InitDefault,
  chainType: '',
  isInitialized: false,
  isLoadingWeb3: false,
  err: '',
  balcEth: '',
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
    console.warn('initializeWallet() failed: Unknown chainType', chainType);
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
/* export type Web3InitOutT = {
  err: string
  warn: string
  chainId: string
  chainName: string
  account: string
    balcEth: string
}*/
/*without immer
  addObjNum1: (by: number) => set((state) => ({
    obj: {
      ...state.obj, num1: state.obj.num1 + by
    }
  })), */
//--------------------==