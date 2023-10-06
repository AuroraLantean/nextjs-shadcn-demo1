import { ItemT } from '@/types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

//Store State interface
type ItemsStoreT = {
  totalNum: number;
  addNum: (by: number) => void;
  decreaseNum: (by: number) => void;
  updateNum: (by: number) => void;
  removeNum: () => void;

  getItems: () => Promise<ItemT[]>;
  items: ItemT[];
  setItems: (items: ItemT[]) => void;
  addVotes: (itemId: string) => void;
  fetchAllItems: () => void;

  obj: { num1: number; num2: number };
  objSum: number;
  addObjNum1: (by: number) => void;
  addObjNum2: (by: number) => void;
  sumObj: () => void;
  //removeObjAll: () => void
}

//Zustand Store can contain primitives, objects, functions. State has to be updated immutably and the set function merges state to help it.
export const useItemsStore = create<ItemsStoreT>()(immer<ItemsStoreT>((set, get) => ({
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
  totalNum: 0,
  addNum: (by: number) => set((state) => ({ totalNum: state.totalNum + by, })),
  decreaseNum: (by: number) => set((state) => ({ totalNum: state.totalNum - by, })),
  updateNum: (by: number) => set({ totalNum: by }),
  removeNum: () => set({ totalNum: 0 }),
  getItems: async () => {
    const res = await fetch(`http://localhost:3000/api/items`);
    const items: ItemT[] = await res.json();
    console.log("items:", items);
    return items;
  },
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
  fetchAllItems: async () => {
    const fetchedItems = await fetchItems();
    if (fetchedItems) set({ items: fetchedItems || [] });
  },
})));
/*addObjNum1: (by: number) => set((state) => ({
    obj: {
      ...state.obj, num1: state.obj.num1 + by
    }
  })), */

export async function fetchItems(): Promise<ItemT[] | null> {
  try {
    const res = await fetch('/api/prompt/new');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return null;
    //const response = await axios.get("http://localhost:8000/photos");
    //return response.data;
  } catch (err) {
    console.log("Error fetching photos: ", err);
    return null;
  }
}