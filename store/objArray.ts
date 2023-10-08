import { createSelectors } from '@/lib/utils';
import { BoxT } from '@/types'
import { createWithEqualityFn } from 'zustand/traditional'
import { immer } from 'zustand/middleware/immer'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { StateCreator } from 'zustand';

//extract functions from store itself...
//const initialState = {}
type BoxesStoreT = {
  totalLength: number;
  boxes: BoxT[];
  refreshBox: (id: string) => Promise<null | BoxT>;
  refreshBoxes: () => void;
}

const makeBoxSlice: StateCreator<BoxesStoreT, [
  ["zustand/immer", never],
  ["zustand/devtools", unknown],
  ["zustand/subscribeWithSelector", never],
  ["zustand/persist", unknown]
]> = (set, get) => ({
  totalLength: 0,
  boxes: [],
  votes: 0,
  refreshBox: async (id: string) => {
    const fetchedBox = await fetchBox(id);
    return fetchedBox;
  },
  refreshBoxes: async () => {
    const fetchedBoxes = await fetchBoxes();
    if (fetchedBoxes) set({ boxes: fetchedBoxes || [] });
  },
});

//Zustand Store can contain primitives, objects, functions. State has to be updated immutably and the set function merges state to help it. immer
export const useBoxesStore = createSelectors(createWithEqualityFn<BoxesStoreT>()(immer(devtools(subscribeWithSelector(persist(makeBoxSlice, {
  name: "Localstorage Box store",
  //storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
  //partialize: (state) => ({ obj: state.obj, objSum: state.objSum }),
  /*partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !["excluded1","excluded2"].includes(key))
        ), */
})), {
  enabled: true,
  name: "ReduxTool Box store",
}
)
)));
//extracting functions out of stores
export const addBox = (box: BoxT) => {
  useBoxesStore.setState((state) => ({
    boxes: [...state.boxes, box],
    totalLength: state.totalLength + 1,
  }));
}
export const deleteBox = (boxId: string) => {
  useBoxesStore.setState((state) => ({
    boxes: state.boxes.filter(box => box.boxId !== boxId),
    totalLength: state.totalLength - 1,
  }));
}
export const updateBox = (boxId: string, title: string, img_url: string, fixed_price: number, min_price: number, bid_price: number, votes: number, status: string) => {
  useBoxesStore.setState((state) => ({
    boxes: state.boxes.map(box =>
      box.boxId === boxId ? {
        title, img_url, fixed_price, min_price, bid_price, votes, status,
      } : box
    )
  }));
}
export const addVotes = (boxId: string) => {
  const oldBoxes = useBoxesStore.getState().boxes;
  const updatedBoxes = oldBoxes.map((box) => {
    if (box.boxId === boxId) return { ...box, votes: box.votes + 1 };
    return box;
  });
  useBoxesStore.setState((state) => ({
    boxes: updatedBoxes
  }));
}
export const findBox = (boxId: string) => {
  return useBoxesStore.getState().boxes.find(box => box.boxId === boxId)
}

export const resetMemState = () => {
  useBoxesStore.setState((state) => ({
    totalLength: 0,
    boxes: [],
  }));
}
/*without immer
  addObjNum1: (by: number) => set((state) => ({
    obj: {
      ...state.obj, num1: state.obj.num1 + by
    }
  })), */
//--------------------==
export async function fetchBox(id: string): Promise<BoxT | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/box/${id}`);
    if (res.ok) {
      const box: BoxT = await res.json();
      console.log("box:", box);
      return box;
    }
    return null;
    //const res = await axios.get("http://...");
    //return res.data;
  } catch (err) {
    console.log("Error fetching box: ", err);
    return null;
  }
}
export async function fetchBoxes(): Promise<BoxT[] | null> {
  try {
    const res = await fetch('/api/prompt/new');
    if (res.ok) {
      const boxes: BoxT[] = await res.json();
      return boxes;
    }
    return null;
    //const res = await axios.get("http://..");
    //return res.data;
  } catch (err) {
    console.log("Error fetching boxes: ", err);
    return null;
  }
}