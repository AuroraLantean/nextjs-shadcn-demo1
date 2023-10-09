"use client"
import React, { useEffect, useState } from 'react'
import BoxCard from './cards/BoxCard';
import { useBoxStore } from '@/store/objArray';
import { useShallow } from 'zustand/react/shallow'
type Props = {}

const TableRows = (props: Props) => {
  console.log("TableRows")
  const [isClient, setIsClient] = useState(false)
  const { totalLength, boxes } = useBoxStore(
    useShallow((state) => ({ totalLength: state.totalLength, boxes: state.boxes, }))
  )
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full flex flex-wrap">
      {isClient ? boxes.map((box) => {
        return (
          <BoxCard key={box.id}
            {...box} />
        );
      }) : null}
    </div>
  )
}

export default TableRows;