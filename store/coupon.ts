//import { create } from "zustand";
import { createWithEqualityFn } from 'zustand/traditional'
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

const initialCouponValue = {
  totalCoupon: 0,
}
export const useCouponStore = createWithEqualityFn<typeof initialCouponValue>()(devtools(subscribeWithSelector(persist(() => initialCouponValue, {
  name: "LocalStorage Coupon store"
})), {
  name: "ReduxTool Coupon store",
}));

//extracting functions out of stores
export const addCoupon = (by: number) => {
  useCouponStore.setState((state) => ({
    totalCoupon: state.totalCoupon + by,
  }));
}
export const subCoupon = (by: number) => {
  useCouponStore.setState((state) => ({
    totalCoupon: state.totalCoupon - by,
  }));
}
export const setCoupon = (by: number) => {
  useCouponStore.setState((state) => ({
    totalCoupon: by,
  }));
}

export const clearStorage = (): void => {
  useCouponStore.setState((state) => ({
    totalCoupon: 0,
  }));
  useCouponStore.persist.clearStorage();
}