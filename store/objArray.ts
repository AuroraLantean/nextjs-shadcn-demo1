import { createSelectors } from '@/lib/utils';
import { ItemT } from '@/types'
import { createWithEqualityFn } from 'zustand/traditional'
import { immer } from 'zustand/middleware/immer'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { StateCreator } from 'zustand';

//extract functions from store itself...
type ItemsStoreT = {
  totalNum: number;
  items: ItemT[];
  refreshItem: (id: string) => Promise<null | ItemT>;
  refreshItems: () => void;
}

const makeItemSlice: StateCreator<ItemsStoreT, [
  ["zustand/immer", never],
  ["zustand/devtools", unknown],
  ["zustand/subscribeWithSelector", never],
  ["zustand/persist", unknown]
]> = (set, get) => ({
  totalNum: 0,
  items: [],
  votes: 0,
  refreshItem: async (id: string) => {
    const fetchedItem = await fetchItem();
    return fetchedItem;
  },
  refreshItems: async () => {
    const fetchedItems = await fetchItems();
    if (fetchedItems) set({ items: fetchedItems || [] });
  },
});

//Zustand Store can contain primitives, objects, functions. State has to be updated immutably and the set function merges state to help it. immer
export const useItemsStore = createSelectors(createWithEqualityFn<ItemsStoreT>()(immer(devtools(subscribeWithSelector(persist(makeItemSlice, {
  name: "Localstorage Item store",
  //storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
  //partialize: (state) => ({ obj: state.obj, objSum: state.objSum }),
  /*partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !["excluded1","excluded2"].includes(key))
        ), */
})), {
  enabled: true,
  name: "ReduxTool Item store",
}
)
)));
//extracting functions out of stores
export const addItem = (item: ItemT) => {
  useItemsStore.setState((state) => ({
    items: [...state.items, item],
    totalNum: state.totalNum + 1,
  }));
}
export const deleteItem = (itemId: string) => {
  useItemsStore.setState((state) => ({
    items: state.items.filter(item => item.item_id !== itemId),
    totalNum: state.totalNum - 1,
  }));
}
export const updateItem = (itemId: string, title: string, img_url: string, fixed_price: number, min_price: number, bid_price: number, votes: number, status: string) => {
  useItemsStore.setState((state) => ({
    items: state.items.map(item =>
      item.item_id === itemId ? {
        title, img_url, fixed_price, min_price, bid_price, votes, status,
      } : item
    )
  }));
}
export const addVotes = (itemId: string) => {
  const oldItems = useItemsStore.getState().items;
  const updatedItems = oldItems.map((item) => {
    if (item.item_id === itemId) return { ...item, votes: item.votes + 1 };
    return item;
  });
  useItemsStore.setState((state) => ({
    items: updatedItems
  }));
}
export const findItem = (itemId: string) => {
  return useItemsStore.getState().items.find(item => item.item_id === itemId)
}

export const resetMemState = () => {
  useItemsStore.setState((state) => ({
    totalNum: 0,
    items: [],
  }));
}
/*without immer
  addObjNum1: (by: number) => set((state) => ({
    obj: {
      ...state.obj, num1: state.obj.num1 + by
    }
  })), */
//--------------------==
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