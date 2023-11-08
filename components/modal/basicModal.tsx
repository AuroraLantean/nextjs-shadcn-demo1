"use client"
import React, { useEffect, useRef, useState } from 'react'
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
import { buyNftSchemaFixed, tokenOnChains } from '@/lib/validators'
import Icons from "@/components/Icons";
import { buyNFT } from '@/lib/actions/radix.actions'
import { cn } from '@/lib/utils'
import { OutT, bigIntZero, buyNFTviaERC20, buyNFTviaETH } from '@/lib/actions/ethers'
import { updateNftStatus, useWeb3Store } from '@/store/web3Store'
import { useShallow } from 'zustand/react/shallow'

type Props = {
  nftId: number,
  priceNative: string,
  priceToken: string,
}
const BasicModal = ({ nftId, priceNative, priceToken }: Props) => {
  const { toast } = useToast()
  const lg = console.log;
  const compoName = 'BasicModal'
  //lg(compoName + ": ", nftId, price)

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { chainType, chainName, nativeAssetName, nativeAssetSymbol, tokenName, tokenSymbol, account, nftOriginalOwner, nftAddr, tokenAddr, salesAddr, nftIds, baseURI, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )
  const inputTokens = [
    { label: nativeAssetSymbol + " on " + chainName, value: tokenOnChains[0] },
    { label: tokenSymbol + " on " + chainName, value: tokenOnChains[1] },
    { label: "GoldCoin on " + chainName, value: tokenOnChains[2] },
    { label: "XRD on Radix", value: tokenOnChains[5] },
    { label: "USDT on Radix", value: tokenOnChains[6] },
  ];// as const;

  type Input = z.infer<typeof buyNftSchemaFixed>;
  const form = useForm<Input>({
    resolver: zodResolver(buyNftSchemaFixed),
    defaultValues: {
      inputToken: tokenOnChains[0],
    },
  })
  const onSubmit = async (values: Input) => {
    lg("onSubmit. nftId:", nftId, ", nftAddr:", nftAddr, ", salesAddr:", salesAddr, ', account:', account)
    setIsLoading(true);
    let hash = ''; let err = '';
    if (values.inputToken === tokenOnChains[0]) {
      ({ str1: hash, err } = await buyNFTviaETH(nftAddr, nftId + '', priceNative, salesAddr, account));

    } else if (values.inputToken === tokenOnChains[1] || values.inputToken === tokenOnChains[2]) {
      ({ str1: hash, err } = await buyNFTviaERC20(nftAddr, nftId, salesAddr, account, tokenAddr, priceToken));

    } else if (values.inputToken === tokenOnChains[3]) {
      ({ str1: hash, err } = await buyNFT(nftId + '', salesAddr, priceNative));

    } else if (values.inputToken === tokenOnChains[4]) {
      ({ str1: hash, err } = await buyNFT(nftId + '', salesAddr, priceNative));
    }
    lg("onSubmit. hash:", hash, ", err:", err)
    if (err) {
      console.error("buy action err:", err)
      toast({ description: `${err}`, variant: 'destructive' })
      setIsLoading(false);
      return;
    }
    const nftIdLast = nftIds.length - 1;
    const statuses = await updateNftStatus(chainType, account, nftOriginalOwner, nftAddr, salesAddr, nftIds[0], nftIds[nftIdLast]);
    if (statuses.err) {
      console.error("status err:", statuses.err)
      toast({ description: `${statuses.err}`, variant: 'destructive' })
      setIsLoading(false);
      return;
    }

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
      //form.reset();
    }
  }, [open]);//form

  const openDialog = () => {
    lg("openDialog")
  }
  //must encase the Context Menu or Dropdown Menu component in the Dialog component
  //{priceNative} {nativeAssetName} / {priceToken} {tokenSymbol}
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className='!bg-primary text-light-2'
          onClick={() => openDialog()}
        >Buy NFT #{nftId}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy NFT  #{nftId}</DialogTitle>
          <DialogDescription>
            Choose input token and blockchain. Confirm NFT ID and enter the required price. Click 'Buy' when you're ready.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="inputToken"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Input Asset</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[290px] justify-between",
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-0">
              <div>
                <FormLabel>NFT Price in {nativeAssetName}: <span className='ml-2 mr-1'>{priceNative}</span>{nativeAssetSymbol}
                </FormLabel>
              </div>
              <div>
                <FormLabel>NFT Price in {tokenName}:
                  <span className='ml-3 mr-1'>{priceToken}</span>{tokenSymbol}
                </FormLabel>
              </div>
              <div>
                <FormLabel>NFT MetaData URI:
                  <span className='ml-3'>{baseURI}{nftId}</span>
                </FormLabel>
              </div>
              <div className='break-all'>
                <FormLabel>NFT Contract Address:
                  <span className='ml-2'>{nftAddr}</span>
                </FormLabel>
              </div>
            </div>

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
              nftId="nftId"
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
            onClick={() => { lg("action") }}
          >Buy Now</Button>
        </DialogFooter>

        */