"use client"
import React from 'react'
import { Button } from '../ui/button';
import { useItemsStore } from '@/store/store';

type Props = {}

const ItemInputForm = (props: Props) => {
  const { totalNum, increaseNum, removeAllNum, items, setItems, increaseVotes, fetchAllItems } = useItemsStore(
    (state) => state
  );
  const addItem = () => {
    console.log('addItem')
    increaseNum(1)
    //return
  }
  const removeItem = () => {
    console.log('removeItem')
    removeAllNum();
  }
  return (
    <div>
      <h1>ItemInputForm</h1>
      <p>TotalNum: {totalNum}</p>
      <div className='flex justify-start'>
        <Button className='!bg-primary mr-2'
          type="button"
          onClick={() => addItem()}
        >Add Item</Button>
        <Button className='!bg-primary' type="button"
          onClick={() => removeItem()}>Remove Item</Button>
      </div>

    </div>
  )
}

export default ItemInputForm;