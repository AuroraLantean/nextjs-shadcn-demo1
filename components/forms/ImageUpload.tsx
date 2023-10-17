"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { cn } from '@/lib/utils';
//import { PickerOverlay } from 'filestack-react';
import * as filestack from 'filestack-js';
import Image from 'next/image';

type Props = {}
type Security = {
  policy: string;
  signature: string;
}
const ImageUpload = (props: Props) => {
  console.log("ImageUpload")
  const filestackApiKey = process.env.NEXT_PUBLIC_FILESTACK_API_KEY;
  if (!filestackApiKey) {
    return <div>FILESTACK_API_KEY not found</div>
  }
  const [security, setSecurity] = useState<Security | null>(null);
  const [uploadedFileHandle, setUploadedFileHandle] = useState("");
  const [isClient, setIsClient] = useState(false);

  const effectRan = useRef(false)
  useEffect(() => {
    if (effectRan.current === true) {
      console.log("ImageUpload useEffect...")
      setIsClient(true)
      const fetchSigAndPolicy = async () => {
        const res = await fetch("/api/filestack-security", {
          method: "POST",
          body: JSON.stringify({ apiName: "fetchSigAndPolicy" }),
        });
        const { data: security } = await res.json();
        console.log("backend security:", security)
        if (security.policy === null) {
          console.log("FILESTACK_APP_SECRET invalid")
        }
        setSecurity(security);//{ policy, signature }
      };
      fetchSigAndPolicy();
    }
    return () => {
      console.log('unmounted')
      effectRan.current = true
    }
  }, [])

  const pickerOptions = {
    accept: ["image/*"],
    onOpen: () => console.log("opened"),
    onClose: () => console.log("closed"),
    onUploadDone: (res: any) => {
      console.log(res)
      setUploadedFileHandle(res.filesUploaded[0].handle)
      //setShowPicker(false)
    }
  }
  const clickToUpload = () => {
    if (security && security.policy) {
      console.log("21 security:", security)
      const clientOptions = { security, }
      const client = filestack.init(filestackApiKey, clientOptions)//https://www.filestack.com/docs/uploads/pickers/web/#security
      client.picker(pickerOptions).open();
    } else {
      console.log("security is falsy. User does not have persmission")
    }
  }

  return (
    <div className={`w-[${APP_WIDTH_MIN}px] gap-2 mb-4`}>
      <h1 className='text-4xl font-bold mb-2'>ImageUpload & Transform. {isClient ? Math.trunc(Math.random() * 10000) : 0}</h1>
      <p className='text-xl mb-4'>Upload your photo... Assuming you have logged in</p>

      <button className={cn("bg-blue hover:bg-purple-500 font-bold py-2 px-4 rounded")} onClick={() => clickToUpload()}>Upload Image File</button>

      <section className='flex gap-x-[30px] mt-10'>
        <div>
          <h2>Uploaded Image</h2>
          {uploadedFileHandle && security !== null && (
            <Image
              src={`https://cdn.filestackcontent.com/${uploadedFileHandle}?policy=${security.policy}&signature=${security.signature}`}
              alt='uploaded image'
              width={350} height={350}
            />
          )}
        </div>
        <div>
          <h2>Transformed Image</h2>
          {uploadedFileHandle && security !== null && (
            <Image
              src={`https://cdn.filestackcontent.com/auto_image/quality=value:95/sepia=tone:85/polaroid/security=policy:${security.policy},signature:${security.signature}/${uploadedFileHandle}`}
              alt='transformed image'
              width={350} height={350}
            />
          )}
        </div>
      </section>
    </div>
  )
}
//onClose={()=> setShowPicker(false)}
//bg-blue-500
export default ImageUpload;
