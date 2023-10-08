"use client"
import React, { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { addNum, addObjNum1, addObjNum2, resetMemState, setNum, subNum, sumObj, useObjStore } from '@/store/obj';
import { Button } from './ui/button';
import { APP_WIDTH_MIN } from '@/constants/site_data';

type Props = {}

//separate the input functions to reduce rerendering
const StateInput = (props: Props) => {
  /*const {  } = useObjStore(
    (state) => ({
      addNum: state.addNum,
      subNum: state.subNum,
      addObjNum1: state.addObjNum1,
      addObjNum2: state.addObjNum2,
      sumObj: state.sumObj,
      resetMemState: state.resetMemState,
    }),
    shallow
  );*///to reduce re-rendering
  //const addObjNum1 = useObjStore.use.addObjNum1();
  //use selector to avoid unnecessary rerendering

  //const { addObjNum1, addObjNum2 } = useObjStore();
  console.log("StateInput")
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  const clearStorage = (): void => {
    resetMemState();
    useObjStore.persist.clearStorage();
  }
  return (
    <div className={`w-[${APP_WIDTH_MIN}px] mr-5 mb-5`}>
      <p>StateInput - Accessing Partial State</p>
      <p>{isClient ? Math.random() : 0}</p>
      <Button className='primary-color m-2' onClick={() => { addNum(1.1) }}>AddNum</Button>
      <Button className='primary-color m-2' onClick={() => { subNum(0.3) }}>SubNum</Button>
      <Button className='primary-color m-2' onClick={() => { addObjNum1(1.1); sumObj(); }}>AddObjNum1</Button>
      <Button className='primary-color m-2' onClick={() => { addObjNum2(0.3); sumObj(); }}>AddObjNum2</Button>

      <Button className='destructive-color m-2' onClick={clearStorage}>Clear Storage</Button>

    </div>
  )
}

export default StateInput;