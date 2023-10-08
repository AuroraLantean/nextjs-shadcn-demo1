import { createSelectors } from '@/lib/utils';
import { ItemT } from '@/types'
import { createWithEqualityFn } from 'zustand/traditional'
import { immer } from 'zustand/middleware/immer'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
//Store State interface
type ItemsStoreT = {
  totalNum: number;
  addNum: (by: number) => void;
  substractNum: (by: number) => void;
  setNum: (by: number) => void;
  resetNum: () => void;

  items: ItemT[];
  setItems: (items: ItemT[]) => void;
  addVotes: (itemId: string) => void;
  refreshItem: (id: string) => Promise<null | ItemT>;
  refreshItems: () => void;

  obj: { num1: number; num2: number };
  objSum: number;
  addObjNum1: (by: number) => void;
  addObjNum2: (by: number) => void;
  sumObj: () => void;
  resetMemState: () => void;
  //removeObjAll: () => void
}

//Zustand Store can contain primitives, objects, functions. State has to be updated immutably and the set function merges state to help it. immer
export const useItemsStore = createSelectors(createWithEqualityFn<ItemsStoreT>()(immer(devtools(subscribeWithSelector(persist((set, get) => ({
  obj: { num1: 0, num2: 0 },
  objSum: 0,
  addObjNum1: (by: number) => set((state) => {
    state.obj.num1 += by
  }),
  addObjNum2: (by: number) => set((state) => {
    state.obj.num2 += by
  }),
  sumObj: () => set((state) => {
    const total = get().obj.num1 + get().obj.num2;
    state.objSum = total
  }),
  resetMemState: () => set(state => ({
    obj: { num1: 0, num2: 0 },
    objSum: 0,
    totalNum: 0,
    items: [],
  })),
  totalNum: 0,
  addNum: (by: number) => set((state) => ({ totalNum: state.totalNum + by, })),
  substractNum: (by: number) => set((state) => ({ totalNum: state.totalNum - by, })),
  setNum: (by: number) => set({ totalNum: by }),
  resetNum: () => set({ totalNum: 0 }),

  items: [],
  setItems: (items: ItemT[]) => set({ items }),
  votes: 0,
  addVotes: (itemId: string) =>
    set((state) => {
      const oldItems = state.items;
      const updatedItems = oldItems.map((item) => {
        if (item.item_id === itemId) return { ...item, votes: item.votes + 1 };
        return item;
      });
      return { items: updatedItems };
    }),
  refreshItem: async (id: string) => {
    const fetchedItem = await fetchItem();
    return fetchedItem;
  },
  refreshItems: async () => {
    const fetchedItems = await fetchItems();
    if (fetchedItems) set({ items: fetchedItems || [] });
  },
}), {
  name: "localstorage item store",
  //storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
  partialize: (state) => ({ obj: state.obj, objSum: state.objSum }),
  /*partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !["excluded1","excluded2"].includes(key))
        ),
 */
})), {
  enabled: true,
  name: "ReduxTool item store",
}
)
)));
/*without immer
  addObjNum1: (by: number) => set((state) => ({
    obj: {
      ...state.obj, num1: state.obj.num1 + by
    }
  })), */


export async function fetchItem(): Promise<ItemT | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/item/{id}`);
    if (res.ok) {
      const item: ItemT = await res.json();
      console.log("item:", item);
      return item;
    }
    return null;
    //const res = await axios.get("http://...");
    //return res.data;
  } catch (err) {
    console.log("Error fetching item: ", err);
    return null;
  }
}
export async function fetchItems(): Promise<ItemT[] | null> {
  try {
    const res = await fetch('/api/prompt/new');
    if (res.ok) {
      const items: ItemT[] = await res.json();
      return items;
    }
    return null;
    //const res = await axios.get("http://..");
    //return res.data;
  } catch (err) {
    console.log("Error fetching items: ", err);
    return null;
  }
}