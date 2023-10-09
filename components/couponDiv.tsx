"use client"
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { addCoupon, resetCouponStorage, setCoupon, subCoupon, useCouponStore } from '@/store/coupon';
import { APP_WIDTH_MIN } from '@/constants/site_data';

type Props = {}

//separate the input functions to reduce rerendering
const CouponDiv = (props: Props) => {
  const { totalCoupon } = useCouponStore();
  //const totalCoupon = useCouponStore((state)=> state.totalCoupon);
  //const totalCoupon = useCouponStore.getState().totalCoupon;//Non-reactive! used in init functions

  console.log("CouponDiv")
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
    //resetCouponStorage(); defeat purpose
    //useCouponStore.persist.clearStorage();
  }, [])


  return (
    <div className={`w-[${APP_WIDTH_MIN}px] mr-5 mb-5`}>
      <p>CouponDiv</p>
      <p>{isClient ? Math.random() : 0}</p>
      <p>Total Coupon: {totalCoupon}</p>
      <Button className='primary-color m-2' onClick={() => { addCoupon(1) }}>Add Coupon</Button>
      <Button className='primary-color m-2' onClick={() => { subCoupon(1) }}>Substract Coupon</Button>
      <Button className='primary-color m-2' onClick={() => setCoupon(0)}>Reset Coupon</Button>

      <Button className='primary-color m-2' onClick={() => { addCoupon(5) }}>Add 5 Coupons</Button>

      <Button className='destructive-color m-2' onClick={resetCouponStorage}>Clear Storage</Button>

    </div>
  )
}

export default CouponDiv;