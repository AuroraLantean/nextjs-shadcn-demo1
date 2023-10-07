"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { useToast } from "@/components/ui/use-toast"
import { buyNftSchema } from '@/lib/validators'
import Icons from "@/components/Icons";
import { buyNFT } from '@/lib/actions/radix.actions'

type Props = {
  id: number
  address: string
  price: number
}
const BasicModal = ({ id, address, price }: Props) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false);

  type Input = z.infer<typeof buyNftSchema>;
  const form = useForm<Input>({
    resolver: zodResolver(buyNftSchema),
    defaultValues: {
      nftId: id?.toString() || "",
      address: address,
      amount: price.toString(),

    },
  })

  const onSubmit = async (values: Input) => {
    console.log("🚀onSubmit:", values)
    setIsLoading(true);
    const { hash, error } = await buyNFT(values);
    console.log("🚀onSubmit. hash:", hash, ", error:", error)

    if (error || !hash) {
      toast({
        title: "Failed",
        description: "Your transaction has failed with error: " + error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Your transaction has been submitted successfully with hash " + hash,
        //action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
    setOpen(false);
    setIsLoading(false);
    //form.reset();
    //revalidatePath(`/mynft/${userAccount}`);
  }

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [form, open]);

  const openDialog = () => {
    console.log("openDialog")
  }
  //must encase the Context Menu or Dropdown Menu component in the Dialog component
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className='!bg-primary text-light-2'
          onClick={() => openDialog()}
        >Buy NFT
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy NFT</DialogTitle>
          <DialogDescription>
            Confirm NFT ID and enter the required price. Click 'Buy' when you're ready.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="nftId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT ID</FormLabel>
                  <FormControl>
                    <Input placeholder="nft id" autoFocus {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>NFT Address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Amount to buy</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="primary-color">

              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Buy Now
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default BasicModal
/**
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nftId" className="text-right">
              NFT ID
            </Label>
            <Input
              id="nftId"
              defaultValue="0"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              defaultValue="10"
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className='!bg-primary !text-light-2'
            onClick={() => { console.log("action") }}
          >Buy Now</Button>
        </DialogFooter>

        */