"use client"
import React, { useEffect, useState } from 'react'
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { useQuery } from "@tanstack/react-query"
import axios from "axios";//axios will throw error if received resp status is not 200!
import BoxCard from './cards/BoxCard';
import { BoxT } from "@/lib/models/box.model"

type Props = {}
const TanstackOut = (props: Props) => {

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  const { data, status, dataUpdatedAt, error, isFetched, isLoading, isSuccess, isError, /*refresh... */ } = useQuery({
    queryKey: ['box'],//, { boxId: id }, "box" is the key so it knows what to query
    //staleTime: 3000,//or Infinity, //using fetched data for this duration
    //cacheTime: 0,//to fetch new data all the time, no cached data!
    queryFn: async () => {
      const { data } = await axios.get('/api/item')
      console.log("🚀 data:", data)
      //const res = await fetch('..');
      //if (!res.ok) throw new Error('...')
      //const data = await res.json();
      return data.boxes as BoxT[];
    },
    enabled: false,
  });
  /**
  fetch data, load, render loading & error
  render boxes
  */

  //{error.message}
  return (
    <div className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <p>Tanstack Query(React Query) Server State Management ... Output</p>
      <p>{isClient ? Math.random() : 0}</p>
      <div className='flex flex-col gap-2'>
        {isLoading ? "Loading..." : ""}
        {isError ? "Error" : ""}
        {data && Array.isArray(data) && data.map(box => (
          <BoxCard key={box._id!} {...box} />
        ))}
      </div>
    </div>
  )
}

export default TanstackOut