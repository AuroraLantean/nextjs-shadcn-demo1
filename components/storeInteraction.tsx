"use client"
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { useDiscountStore } from '@/store/discount';

type Props = {}

//separate the input functions to reduce rerendering
const StoreInteraction = (props: Props) => {
  const { totalDiscount, addDiscount, substractDiscount, setDiscount } = useDiscountStore();

  console.log("StoreInteraction")
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className=''>
      <p>StoreInteraction</p>
      <p>{isClient ? Math.random() : 0}</p>
      <p>Total Discount: {totalDiscount}</p>
      <Button className='primary-color m-2' onClick={() => { addDiscount(1) }}>Add Discount</Button>
      <Button className='primary-color m-2' onClick={() => { substractDiscount(1) }}>Substract Discount</Button>

      <Button className='destructive-color m-2' onClick={() => setDiscount(0)}>Set Discount</Button>

    </div>
  )
}

export default StoreInteraction;