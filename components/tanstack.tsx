"use client"
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from "axios";//axios will throw error if received resp status is not 200!
import { Button } from './ui/button';
import { APP_WIDTH_MIN } from '@/constants/site_data';

/**
fetch data, load, render loading & error
render box
*/
type Props = {}
const TanstackCompo = (props: Props) => {

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <p>StateInput - Accessing Partial State</p>
      <p>{isClient ? Math.random() : 0}</p>

    </div>
  )
}
/**
    <div className='flex flex-col gap-2'>
      TanstackCompo
    </div>
 */
export default TanstackCompo