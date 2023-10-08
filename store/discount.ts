import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type DiscountStoreT = {
  totalDiscount: number;
  addDiscount: (by: number) => void;
  substractDiscount: (by: number) => void;
  setDiscount: (by: number) => void;
}

export const useDiscountStore = create<DiscountStoreT>()(subscribeWithSelector((set) => ({
  totalDiscount: 0,
  addDiscount: (by: number) => set((state) => ({
    totalDiscount: state.totalDiscount + by
  })),
  substractDiscount: (by: number) => set((state) => ({
    totalDiscount: state.totalDiscount - by
  })),
  setDiscount: (by: number) => set((state) => ({
    totalDiscount: by
  })),
})));