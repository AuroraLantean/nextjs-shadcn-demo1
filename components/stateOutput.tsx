"use client"
import React, { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useShallow } from 'zustand/react/shallow'
import { useObjStore } from '@/store/obj';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useCouponStore } from '@/store/coupon';
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { useBoxStore } from '@/store/objArray';

type Props = {}

//select multi states to reduce rerendering
const StateOutput = (props: Props) => {
  const { totalNum, objSum, num1, num2 } = useObjStore(
    useShallow((state) => ({ totalNum: state.totalNum, objSum: state.objSum, num1: state.obj.num1, num2: state.obj.num2 }))
  )//const totalNum = useObjStore((state) => state.totalNum);

  const [isClient, setIsClient] = useState(false)
  const [style1, setStyle1] = useState(useCouponStore.getState().totalCoupon >= totalNum ? "text-green-600" : "text-red-600");
  /*const totalDicount = useCouponStore((state) => state.totalCoupon);//causing this compo to rerender!
  console.log("a.", totalDicount);
  let style = totalDicount > 3 ? 'text-green-600' : 'text-red-600';
  */
  useEffect(() => {
    setIsClient(true);
    const unsub = useCouponStore.subscribe((state) => state.totalCoupon, (totalCoupon, prevCoupon) => {
      console.log("StateOutput...", prevCoupon, totalCoupon, totalNum);

      if (totalNum > totalCoupon) { setStyle1("text-red-600") } else { setStyle1("text-green-600") }
    }, {
      equalityFn: shallow,
      fireImmediately: true,//at 1st time to run above
    })
    /*const unsub = useCouponStore.subscribe((state, prevState) => {
      console.log("state:", state, ", prevState:", prevState);
      if (prevState.totalCoupon < totalNum && state.totalCoupon >= totalNum) { setStyle1("text-green-600"); } else if (prevState.totalCoupon >= totalNum && state.totalCoupon < totalNum) { setStyle1("text-red-600"); }
    });*/
    return unsub;//to unsubscribe it when leaving this component
  }, [totalNum])
  //const { obj: { num1, num2 } } = useObjStore();

  return (
    <Card className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <CardHeader>
        <CardTitle>StateOutput - Accessing Partial State</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{isClient ? Math.random() : 0}</p>
        <p className={style1}>Have Enough Coupon?</p>
        <p>totalCoupon: na</p>
        <p>TotalNum: {totalNum}</p>
        <p>TotalObjNum: {objSum}</p>
        <p>Obj num1:{num1}, num2: {num2}</p>

      </CardContent>
    </Card>
  )
}
//<p>{Math.random()}</p>
export default StateOutput;