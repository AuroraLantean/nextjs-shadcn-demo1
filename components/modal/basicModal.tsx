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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverTrigger } from '../ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { PopoverContent } from '../ui/popoverM'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronsUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useToast } from "@/components/ui/use-toast"
import { buyNftSchema, tokenOnChains } from '@/lib/validators'
import Icons from "@/components/Icons";
import { buyNFT } from '@/lib/actions/radix.actions'
import { cn } from '@/lib/utils'
import { OutT, bigIntZero, buyNFTviaERC20, buyNFTviaETH } from '@/lib/actions/ethers'

type Props = {
  id: number
  address: string
  price: number
}
const BasicModal = ({ id, address, price }: Props) => {
  const { toast } = useToast()
  const inputTokens = [
    { label: "ETH on Ethereum", value: tokenOnChains[0] },
    { label: "USDT on Ethereum", value: tokenOnChains[1] },
    { label: "GoldCoin on Ethereum", value: tokenOnChains[2] },
    { label: "XRD on Radix", value: tokenOnChains[3] },
    { label: "USDT on Radix", value: tokenOnChains[4] },
  ] as const
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false);

  type Input = z.infer<typeof buyNftSchema>;
  const form = useForm<Input>({
    resolver: zodResolver(buyNftSchema),
    defaultValues: {
      inputToken: tokenOnChains[0],
      nftId: id?.toString() || "",
      address: address,
      amount: price.toString(),
    },
  })

  const onSubmit = async (values: Input) => {
    console.log("🚀onSubmit:", values)
    setIsLoading(true);
    let hash = ''; let err = '';
    if (values.inputToken === tokenOnChains[0]) {
      ({ str1: hash, err } = await buyNFTviaETH(values.nftId, values.amount, values.address));

    } else if (values.inputToken === tokenOnChains[1] || values.inputToken === tokenOnChains[2]) {
      ({ str1: hash, err } = await buyNFTviaERC20(values.nftId, values.address));

    } else if (values.inputToken === tokenOnChains[3]) {
      ({ str1: hash, err } = await buyNFT(values));

    } else if (values.inputToken === tokenOnChains[4]) {
      ({ str1: hash, err } = await buyNFT(values));
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
            Choose input token and blockchain. Confirm NFT ID and enter the required price. Click 'Buy' when you're ready.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="inputToken"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Input Token</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? inputTokens.find(
                              (inputToken) => inputToken.value === field.value
                            )?.label
                            : "Select input token"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search token..." />
                        <CommandEmpty>No token found.</CommandEmpty>
                        <CommandGroup>
                          {inputTokens.map((inputToken) => (
                            <CommandItem
                              value={inputToken.label}
                              key={inputToken.value}
                              onSelect={() => {
                                form.setValue("inputToken", inputToken.value)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  inputToken.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {inputToken.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the input token
                  </FormDescription>
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