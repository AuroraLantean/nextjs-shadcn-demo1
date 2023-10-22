"use client"
import React, { useEffect, useRef, useState } from 'react'
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { BoxT } from '@/lib/models/box.model';
import { Switch } from './ui/switch';
import { delayFunc, parseIntSafe } from '@/lib/utils';

type Props = {}
const TanstackIn = (props: Props) => {
  const lg = console.log;
  const effectRan = useRef(false)
  const { toast } = useToast();
  const box0 = { id: "", title: "", total: 0 }
  const [box, setBox] = useState<Partial<BoxT>>(box0);
  const [isToFetch, setIsToFetch] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    if (effectRan.current === true) {
      lg("TanstackIn useEffect...")
      setIsClient(true);
    }
    return () => {
      lg("TanstackIn unmounted useeffect()...")
      effectRan.current = true
    }
  }, [])

  const queryClient = useQueryClient();
  const { mutate: addBox, isLoading } = useMutation({
    mutationFn: async (box: Partial<BoxT>) => await axios.post('/api/item', { box }),
    onSuccess: () => {
      toast({ description: "Success" });
      setBox(box0);
      queryClient.invalidateQueries(["box"], { exact: true })
    },
    onError: (err: any) => {
      lg("err:", err)
      toast({ description: `Failed: ${err.message}`, variant: 'destructive' })
    },
  })
  const { mutate: deleteBox, isLoading: isLoadingD } = useMutation({
    mutationFn: async (id: string) => await axios.delete(`/api/item`, { params: { id } }),//${id} not allowed
    onSuccess: () => {
      toast({ description: "Success" });
      setBox(box0);
      queryClient.invalidateQueries(["box"], { exact: true })
    },
    onError: (err: any) => {
      lg("err:", err)
      toast({ description: `Failed: ${err.message}`, variant: 'destructive' })
    },
  })
  const { mutate: updateBox, isLoading: isLoadingU } = useMutation({
    mutationFn: async (box: Partial<BoxT>) => await axios.put(`/api/item`, { box }),
    onSuccess: () => {
      toast({ description: "Success" });
      setBox(box0);
      queryClient.invalidateQueries(["box"], { exact: true })
    },
    onError: (err: any) => {
      lg("err:", err)
      toast({ description: `Failed: ${err.message}`, variant: 'destructive' })
    },
  })
  //status: status1, dataUpdatedAt, error, isFetched,  isSuccess, refresh..
  const { data: data1, isLoading: isLoading1, isSuccess: isSuccess1, isError: isError1 } = useQuery({
    queryKey: ['boxOne'],
    queryFn: async () => {
      const id = box.id + "";
      lg("to fetch one box. id:", id)
      let out;
      if (box.id === "") {
        const mesg = "id is empty. reset to 1"
        lg(mesg)
        setBox(box0);
        toast({ description: `${mesg}` })
        out = await axios.get(`/api/item/?id=1`)
      } else {
        out = await axios.get(`/api/item/?id=${id}`)
      }
      const { data } = out;
      lg("🚀 data1:", data)
      return data.box as BoxT;
    },
    enabled: isToFetch,
  });
  useEffect(() => {
    lg("new out data1:", data1)
    if (isSuccess1 && data1) {
      setBox({ ...data1 })
    }
  }, [data1])

  return (
    <div className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <p className='text-2xl font-semibold'>Tanstack Query(React Query) Server State Management Input. {isClient ? Math.trunc(Math.random() * 10000) : 0}</p>
      <div className='flex gap-2 min-w-full'>
        <Input placeholder='id' value={box.id}
          onChange={e => setBox(prev => ({ ...prev, id: e.target.value }))} disabled={isLoading || isLoadingU || isLoadingD} />
        <Input placeholder='title' value={box.title}
          onChange={e => setBox(prev => ({ ...prev, title: e.target.value }))} disabled={isLoading || isLoadingU || isLoadingD} />
        <Input placeholder='total' value={box.total}
          onChange={e => setBox(prev => ({ ...prev, total: parseIntSafe(e.target.value) }))} disabled={isLoading || isLoadingU || isLoadingD} />
      </div>
      <div className=''>
        <div className='flex gap-2 mt-2'>
          <Switch className='' id="airplane-mode" checked={isToFetch} onCheckedChange={setIsToFetch} />
          <p>Auto Refresh By Id</p>
        </div>
        <div className='flex'>
          <Button
            onClick={() => addBox(box)}
            isLoading={isLoading}
            disabled={isLoading || isLoadingU || isLoadingD}
          >Add</Button>
          <Button
            onClick={() => updateBox(box)}
            isLoading={isLoadingU}
            disabled={isLoading || isLoadingU || isLoadingD}
          >Update</Button>
          <Button
            onClick={() => {
              if (box.id) deleteBox(box.id)
            }}
            isLoading={isLoadingD}
            disabled={isLoading || isLoadingU || isLoadingD}
          >Delete</Button>
        </div>

      </div>
    </div>
  )
}

export default TanstackIn