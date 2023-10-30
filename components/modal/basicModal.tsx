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
import { OutT, bigIntZero, buyNFTviaERC20, buyNFTviaETH } from '@/lib/actions/ethers'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

type Props = {
  id: number
  address: string
  price: number
}
const BasicModal = ({ id, address, price }: Props) => {
  const { toast } = useToast()
  const inputToken = [
    { label: "ETH", value: "eth" },
    { label: "USDT", value: "usdt" },
    { label: "Radix", value: "radix" },
    { label: "xUSDT", value: "xusdt" },
  ] as const
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false);

  type Input = z.infer<typeof buyNftSchema>;
  const form = useForm<Input>({
    resolver: zodResolver(buyNftSchema),
    defaultValues: {
      enum1: "eth",
      nftId: id?.toString() || "",
      address: address,
      amount: price.toString(),
    },
  })

  let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] }
  const onSubmit = async (values: Input) => {
    console.log("🚀onSubmit:", values)
    setIsLoading(true);
    let hash = ''; let err = '';
    if (values.enum1 === "eth") {
      ({ str1: hash, err } = await buyNFTviaETH(values.nftId, values.amount, values.address));

    } else if (values.enum1 === "erc20") {
      ({ str1: hash, err } = await buyNFTviaERC20(values.nftId, values.address));

    } else if (values.enum1 === "xrd") {
      ({ str1: hash, err } = await buyNFT(values));
    } else if (values.enum1 === "xToken") {

    }
    console.log("onSubmit. hash:", hash, ", err:", err)

    if (err || !hash) {
      toast({
        title: "Failed",
        description: "Your transaction has failed with err: " + err,
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
            Choose payment type. Confirm NFT ID and enter the required price. Click 'Buy' when you're ready.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="enum1"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className='flex flex-wrap'>
                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="eth" />
                          </FormControl>
                          <FormLabel>
                            ETH
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="erc20" />
                          </FormControl>
                          <FormLabel>
                            ERC20 USDT
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="xrd" />
                          </FormControl>
                          <FormLabel>
                            XRD
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="xToken" />
                          </FormControl>
                          <FormLabel>
                            xUSDT
                          </FormLabel>
                        </FormItem>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              isLoading={isLoading}
              disabled={isLoading}
              className="primary-color">
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