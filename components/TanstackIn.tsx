"use client"
import React, { useEffect, useState } from 'react'
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from './ui/use-toast';

type Props = {}
const TanstackIn = (props: Props) => {
  const { toast } = useToast();
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  const queryClient = useQueryClient();
  const { mutate: addBox, isLoading } = useMutation({
    mutationFn: async () => await axios.post('/api/item', { box: { id, title, total } }),
    onSuccess: () => {
      toast({ description: "Success" });
      setId(''); setTitle(''); setTotal('');
      queryClient.invalidateQueries(["box"])
    },
    onError: (err: any) => {
      console.log("err:", err)
      toast({ description: `Failed: ${err.message}`, variant: 'destructive' })
    },
  })
  const { mutate: deleteBox, isLoading: isLoadingD } = useMutation({
    mutationFn: async () => await axios.delete(`/api/item`, { params: { id } }),//${id} not allowed
    onSuccess: () => {
      toast({ description: "Success" });
      setId(''); setTitle(''); setTotal('');
      queryClient.invalidateQueries(["box"])
    },
    onError: (err: any) => {
      console.log("err:", err)
      toast({ description: `Failed: ${err.message}`, variant: 'destructive' })
    },
  })
  const { mutate: updateBox, isLoading: isLoadingU } = useMutation({
    mutationFn: async () => await axios.put(`/api/item`, { box: { id, title, total } }),
    onSuccess: () => {
      toast({ description: "Success" });
      setId(''); setTitle(''); setTotal('');
      queryClient.invalidateQueries(["box"])
    },
    onError: (err: any) => {
      console.log("err:", err)
      toast({ description: `Failed: ${err.message}`, variant: 'destructive' })
    },
  })

  return (
    <div className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <p>Tanstack Query(React Query) Server State Management ... Input</p>
      <p>{isClient ? Math.random() : 0}</p>
      <div className='flex gap-2 min-w-full'>
        <Input placeholder='id' value={id}
          onChange={e => setId(e.target.value)} disabled={isLoading || isLoadingU || isLoadingD} />
        <Input placeholder='title' value={title}
          onChange={e => setTitle(e.target.value)} disabled={isLoading || isLoadingU || isLoadingD} />
        <Input placeholder='total' value={total}
          onChange={e => setTotal(e.target.value)} disabled={isLoading || isLoadingU || isLoadingD} />
      </div>
      <div>
        <Button
          onClick={() => addBox()}
          isLoading={isLoading}
          disabled={isLoading || isLoadingU || isLoadingD}
        >Add</Button>
        <Button
          onClick={() => updateBox()}
          isLoading={isLoadingU}
          disabled={isLoading || isLoadingU || isLoadingD}
        >Update</Button>
        <Button
          onClick={() => deleteBox()}
          isLoading={isLoadingD}
          disabled={isLoading || isLoadingU || isLoadingD}
        >Delete</Button>
      </div>
    </div>
  )
}

export default TanstackIn