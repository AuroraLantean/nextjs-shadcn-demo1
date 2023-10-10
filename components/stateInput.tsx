"use client"
import React, { useEffect, useState } from 'react'
import { addNum, addObjNum1, addObjNum2, resetObjNumMemState, setNum, subNum, sumObj, useObjStore } from '@/store/obj';
import { Button } from './ui/button';
import { APP_WIDTH_MIN } from '@/constants/site_data';
import box_data from '@/mockdata/box_data.json'
import { addBox, addVotes, deleteBox, findBox, resetObjArrMemState, updateBox, useBoxStore } from '@/store/objArray';

type Props = {}

//separate the input functions to reduce rerendering
const StateInput = (props: Props) => {
  const box1 = box_data[0];
  const box2 = box_data[1];
  const box3 = box_data[2];
  const box4 = box_data[3];
  console.log("StateInput")

  const [isClient, setIsClient] = useState(false)
  const [box3votes, setBox3votes] = useState<null | number>(null);
  useEffect(() => {
    setIsClient(true)
    //clearStorage() defeat purpose
  }, [])
  const clearStorage = (): void => {
    resetObjNumMemState();
    resetObjArrMemState();
    useObjStore.persist.clearStorage();
    useBoxStore.persist.clearStorage();
  }
  const updateBox3 = () => {
    updateBox({
      ...box3, available: 1000, total: 2000, interest: 100, title: "new_title3"
    });
  }
  const findBoxVotes = (id: string) => {
    console.log(id)
    const out = findBox(id);
    console.log(out)
    if (typeof out === "object") {
      console.log(out.votes)
      setBox3votes(out.votes)
    } else {
      setBox3votes(null)
    }
  }
  const addRows = () => {
    box_data.slice(0, 3).map((box) => {
      console.log("adding box ", box.id)
      addBox(box)
    })
  }

  return (
    <div className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <p>StateInput - Accessing Partial State</p>
      <p>{isClient ? Math.random() : 0}, boxVotes: {box3votes}</p>
      <Button className='primary-color m-2' onClick={() => addNum(1.1)}>AddNum</Button>
      <Button className='primary-color m-2' onClick={() => subNum(0.3)}>SubNum</Button>
      <Button className='primary-color m-2' onClick={() => { addObjNum1(1.1); sumObj(); }}>AddObjNum1</Button>
      <Button className='primary-color m-2' onClick={() => { addObjNum2(0.3); sumObj(); }}>AddObjNum2</Button>

      <Button className='destructive-color m-2' onClick={clearStorage}>Clear Storage</Button>

      <Button className='primary-color m-2' onClick={() => addRows()}>Add All Boxes</Button>
      <Button className='primary-color m-2' onClick={() => addBox(box4)}>AddBox4</Button>
      <Button className='primary-color m-2' onClick={() => findBoxVotes(3 + "")}>FindBox3 votes</Button>
      <Button className='secondary500-color m-2' onClick={() => updateBox3()}>UpdateBox3</Button>
      <Button className='secondary500-color m-2' onClick={() => addVotes(3 + "")}>AddVoteBox3</Button>
      <Button className='destructive-color m-2' onClick={() => deleteBox(2 + "")}>DeleteBox2</Button>
    </div>
  )
}

export default StateInput;
/**
  const {  } = useObjStore(
    (state) => ({
      addNum: state.addNum,
      subNum: state.subNum,
      addObjNum1: state.addObjNum1,
      addObjNum2: state.addObjNum2,
      sumObj: state.sumObj,
      resetObjNumMemState: state.resetObjNumMemState,
    }),
    shallow
  );//to reduce re-rendering
  //const addObjNum1 = useObjStore.use.addObjNum1();
  //use selector to avoid unnecessary rerendering
 */