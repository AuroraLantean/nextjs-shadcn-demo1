"use client"
import React, { useEffect, useState } from 'react'
import { shallow, useShallow } from 'zustand/shallow'
import { useItemsStore } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useDiscountStore } from '@/store/discount';

type Props = {}

//select multi states to reduce rerendering
const StateOutput = (props: Props) => {
  const { totalNum, objSum, num1, num2 } = useItemsStore(
    useShallow((state) => ({ totalNum: state.totalNum, objSum: state.objSum, num1: state.obj.num1, num2: state.obj.num2 }))
  )
  //const totalNum = useItemsStore((state) => state.totalNum);

  const [isClient, setIsClient] = useState(false)
  const [style1, setStyle1] = useState("");
  /*const totalDicount = useDiscountStore((state) => state.totalDiscount);//causing this compo to rerender!
  console.log("a.", totalDicount);
  let style = totalDicount > 3 ? 'text-green-600' : 'text-red-600';
  */
  useEffect(() => {
    setIsClient(true);
    const unsub = useDiscountStore.subscribe((state) => state.totalDiscount, (totalDiscount, prevDiscount) => {
      console.log(prevDiscount, totalDiscount);

      if (prevDiscount == totalDiscount) {
        if (totalDiscount >= totalNum) { setStyle1("text-green-600"); } else { setStyle1("text-red-600"); }
      }

      if (prevDiscount < totalNum && totalDiscount >= totalNum) { setStyle1("text-green-600"); } else if (prevDiscount >= totalNum && totalDiscount < totalNum) { setStyle1("text-red-600"); }
    }, {
      equalityFn: shallow,
      fireImmediately: true,//at 1st time to run above
    })
    /*const unsub = useDiscountStore.subscribe((state, prevState) => {
      console.log("state:", state, ", prevState:", prevState);
      if (prevState.totalDiscount < totalNum && state.totalDiscount >= totalNum) { setStyle1("text-green-600"); } else if (prevState.totalDiscount >= totalNum && state.totalDiscount < totalNum) { setStyle1("text-red-600"); }
    });*/
    return unsub;//to unsubscribe it when leaving this component
  }, [totalNum])
  //const { obj: { num1, num2 } } = useItemsStore();

  return (
    <div>
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>StateOutput - Accessing Partial State</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{isClient ? Math.random() : 0}</p>
          <p className={style1}>isDiscounted</p>
          <p>totalDicount: na</p>
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