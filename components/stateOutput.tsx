"use client"
import React, { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { useItemsStore } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type Props = {}

//select multi states to reduce rerendering
const StateOutput = (props: Props) => {
  const { totalNum, objSum, num1, num2 } = useItemsStore(
    useShallow((state) => ({ totalNum: state.totalNum, objSum: state.objSum, num1: state.obj.num1, num2: state.obj.num2 }))
  )
  console.log("StateOutput...");
  /*const totalNum = useItemsStore((state) => state.totalNum);
*/
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  //const { obj: { num1, num2 } } = useItemsStore();

  return (
    <div>
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>StateOutput - Accessing Partial State</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{isClient ? Math.random() : 0}</p>
          <p>TotalNum: {totalNum}</p>
          <p>TotalObjNum: {objSum}</p>
          <p>Obj num1:{num1}, num2: {num2}</p>
        </CardContent>
      </Card>
    </div>
  )
}
//<p>{Math.random()}</p>
export default StateOutput;