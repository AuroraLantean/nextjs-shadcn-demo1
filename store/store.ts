import { ItemT } from '@/types'
import { create } from 'zustand'

//Store State interface
type ItemsStoreT = {
  totalNum: number
  increaseNum: (by: number) => void
  decreaseNum: (by: number) => void
  updateNum: (by: number) => void
  removeAllNum: () => void
  getItems: () => Promise<ItemT[]>;
  items: ItemT[]
  setItems: (items: ItemT[]) => void
  increaseVotes: (itemId: string) => void;
  fetchAllItems: () => void;
}

//Zustand Store can contain primitives, objects, functions. State has to be updated immutably and the set function merges state to help it.
export const useItemsStore = create<ItemsStoreT>()((set) => ({
  totalNum: 0,
  increaseNum: (by: number) => set((state) => ({ totalNum: state.totalNum + by, })),
  decreaseNum: (by: number) => set((state) => ({ totalNum: state.totalNum - by, })),
  updateNum: (by: number) => set({ totalNum: by }),
  removeAllNum: () => set({ totalNum: 0 }),
  getItems: async () => {
    const res = await fetch(`http://localhost:3000/api/items`);
    const items: ItemT[] = await res.json();
    console.log("items:", items);
    return items;
  },
  items: [],
  setItems: (items: ItemT[]) => set({ items }),
  votes: 0,
  increaseVotes: (itemId: string) =>
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
}));

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