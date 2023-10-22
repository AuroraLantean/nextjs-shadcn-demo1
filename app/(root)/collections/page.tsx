"use client"
import { TabsOne } from "@/components/TabOne";
import React from 'react'
import CarouselClickable from "@/components/carousel/CarouselClickable";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/forms/ImageUpload";
import FormGeneral from "@/components/forms/formGeneral";

type Props = {}

const CollectionPage = (props: Props) => {
  return (
    <div className=''>
      <CarouselClickable />
      <Separator className="my-1" />
      <div className="flex flex-row">
        <div>
          <ImageUpload />
          <TabsOne />
        </div>
        <FormGeneral />
      </div>
    </div>
  )
}

export default CollectionPage;
