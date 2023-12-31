import { createSelectors } from '@/lib/utils';
import { createWithEqualityFn } from 'zustand/traditional'
import { immer } from 'zustand/middleware/immer'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { StateCreator } from 'zustand';

//Store State interface
// extract functions via setState... 
const initialState = {
  obj: { num1: 0, num2: 0 },
  objSum: 0,
  totalNum: 0,
}
const makeObjSlice: StateCreator<typeof initialState, [
  ["zustand/immer", never],
  ["zustand/devtools", unknown],
  ["zustand/subscribeWithSelector", never],
  ["zustand/persist", unknown]
]> = (set, get) => (initialState);

//Zustand Store can contain primitives, objects, functions. State has to be updated immutably and the set function merges state to help it. immer
export const useObjStore = createSelectors(createWithEqualityFn<typeof initialState>()(immer(devtools(subscribeWithSelector(persist(makeObjSlice, {
  name: "Obj store",
  //storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
  partialize: (state) => ({ obj: state.obj, objSum: state.objSum }),
  /*partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !["excluded1","excluded2"].includes(key))
        ), */
})), {
  enabled: true,
  name: "ReduxTool Obj store",
}
)
)));
//extracting functions out of stores
export const addObjNum1 = (by: number) => {
  useObjStore.setState((state) => ({
    obj: { ...state.obj, num1: state.obj.num1 + by },
  }));
}
export const addObjNum2 = (by: number) => {
  useObjStore.setState((state) => ({
    obj: { ...state.obj, num2: state.obj.num2 + by },
  }));
}
export const sumObj = () => {
  useObjStore.setState((state) => ({
    objSum: state.obj.num1 + state.obj.num2,
  }));
}
export const resetObjNumMemState = () => {
  useObjStore.setState((state) => ({
    obj: { num1: 0, num2: 0 },
    objSum: 0,
    totalNum: 0,
  }));
}
export const addNum = (by: number) => {
  useObjStore.setState((state) => ({
    totalNum: state.totalNum + by,
  }));
}
export const subNum = (by: number) => {
  useObjStore.setState((state) => ({
    totalNum: state.totalNum - by,
  }));
}
export const setNum = (num: number) => {
  useObjStore.setState((state) => ({
    totalNum: num,
  }));
}

/*without immer
  addObjNum1: (by: number) => set((state) => ({
    obj: {
      ...state.obj, num1: state.obj.num1 + by
    }
  })), */
//--------------------==