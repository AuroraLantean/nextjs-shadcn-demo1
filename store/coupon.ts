import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type CouponStoreT = {
  totalCoupon: number;
  addCoupon: (by: number) => void;
  substractCoupon: (by: number) => void;
  setCoupon: (by: number) => void;
}

export const useCouponStore = create<CouponStoreT>()(subscribeWithSelector((set) => ({
  totalCoupon: 0,
  addCoupon: (by: number) => set((state) => ({
    totalCoupon: state.totalCoupon + by
  })),
  substractCoupon: (by: number) => set((state) => ({
    totalCoupon: state.totalCoupon - by
  })),
  setCoupon: (by: number) => set((state) => ({
    totalCoupon: by
  })),
})));