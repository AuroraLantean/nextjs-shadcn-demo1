"use client"
import { TabsOne } from "@/components/TabOne";
import React from 'react'
import CarouselClickable from "@/components/carousel/CarouselClickable";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/forms/ImageUpload";
import FormGeneral from "@/components/forms/formGeneral";
import StateOutput from "@/components/stateOutput";
import StateInput from "@/components/forms/StateInput";
import CouponDiv from "@/components/couponDiv";
import TableRows from "@/components/tableRows";
import ZustandInputForm from "@/components/forms/ZustandInputForm";

type Props = {}

const CollectionPage = (props: Props) => {
  return (
    <div className=''>
      <CarouselClickable />
      <Separator className="my-1" />
      <div className="flex flex-wrap">
        <ImageUpload />
        <TabsOne />
        <FormGeneral />
        <Separator className="my-2" />
        <ZustandInputForm />
        <StateOutput />
        <StateInput />
        <CouponDiv />
        <TableRows />
      </div>
    </div>
  )
}

export default CollectionPage;
