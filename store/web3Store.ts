import { capitalizeFirst, createSelectors } from '@/lib/utils';
import { createWithEqualityFn } from 'zustand/traditional'
import { immer } from 'zustand/middleware/immer'
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { ethersInit, getBalanceEth } from '@/lib/actions/ethers';

export type Web3InitOutT = {
  err: string
  warn: string
  chainId: string
  chainName: string
  account: string
  balcEth: string
}
const initialState = {
  chainType: '',
  isInitialized: false,
  chainName: '',
  chainId: '',
  account: '',
  isLoadingWeb3: false,
  error: '',
  balcEth: '',
  //txnHash: '',
  // signer: undefined,
  // provider: undefined,
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
//extracting functions out of stores
export const initializeWallet = async (chainType = 'evm') => {
  useWeb3Store.setState((state) => ({
    isLoadingWeb3: true,
  }));
  let initOut: Partial<Web3InitOutT> = { err: '', warn: '', chainId: '', chainName: '', account: '' };

  if (chainType === 'evm') {
    initOut = await ethersInit();

  } else if (chainType === 'radix') {

  } else {
    console.warn('initializeWallet() failed: Unknown chainType', chainType);
  }
  //const out = await getBalanceEth(initOut.account!)
  useWeb3Store.setState((state) => ({
    ...state,
    chainType,
    isInitialized: true,
    chainName: capitalizeFirst(initOut.chainName!),
    chainId: initOut.chainId!,
    account: initOut.account!,
    isLoadingWeb3: false,
    //balcEth: out.str1,
    // signer: undefined,
    // provider: undefined,
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