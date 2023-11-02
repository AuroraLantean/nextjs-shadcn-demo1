"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buyNftSchema, tokenOnChains } from '@/lib/validators';
import { cn } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { updateNftStatus, useWeb3Store } from '@/store/web3Store';
import { buyNFTviaERC20, buyNFTviaETH } from '@/lib/actions/ethers';
import { buyNFT } from '@/lib/actions/radix.actions';
import { useShallow } from 'zustand/react/shallow'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';

type Props = {}

const NftBuyForm = (props: Props) => {
  const lg = console.log;
  const compoName = 'NftBuyForm'
  const inputTokens = [
    { label: "ETH on Ethereum", value: tokenOnChains[0] },
    { label: "USDT on Ethereum", value: tokenOnChains[1] },
    { label: "GoldCoin on Ethereum", value: tokenOnChains[2] },
    { label: "XRD on Radix", value: tokenOnChains[3] },
    { label: "USDT on Radix", value: tokenOnChains[4] },
  ] as const;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { chainType, isInitialized, chainName, chainId, account, nftOriginalOwner, nftAddr, salesAddr, nftIds, prices, baseURI, isLoadingWeb3, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )

  lg(compoName + "()...")
  type Input = z.infer<typeof buyNftSchema>;
  const form = useForm<Input>({
    resolver: zodResolver(buyNftSchema),
    defaultValues: {
      inputToken: tokenOnChains[0],
      nftId: "",
      amount: "",
    },
  })

  const onSubmit = async (values: Input) => {
    lg("🚀onSubmit:", values, salesAddr)
    setIsLoading(true);
    let hash = ''; let err = '';
    if (values.inputToken === tokenOnChains[0]) {
      ({ str1: hash, err } = await buyNFTviaETH(values.nftId, values.amount, salesAddr));

    } else if (values.inputToken === tokenOnChains[1] || values.inputToken === tokenOnChains[2]) {
      ({ str1: hash, err } = await buyNFTviaERC20(values.nftId, salesAddr));

    } else if (values.inputToken === tokenOnChains[3]) {
      ({ str1: hash, err } = await buyNFT(values.nftId, salesAddr, values.amount));

    } else if (values.inputToken === tokenOnChains[4]) {
      ({ str1: hash, err } = await buyNFT(values.nftId, salesAddr, values.amount));
    }
    lg("onSubmit. hash:", hash, ", err:", err)

    const nftIdLast = nftIds.length - 1;
    const statuses = await updateNftStatus(chainType, account, nftOriginalOwner, nftAddr, salesAddr, nftIds[0], nftIds[nftIdLast]);
    if (statuses.err) {
      console.error("status err:", statuses.err)
      toast({ description: `${statuses.err}`, variant: 'destructive' })
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
    //form.reset();
    //revalidatePath(`/mynft/${userAccount}`);
  }

  return (
    <Card className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <CardHeader>
        <CardTitle>NftBuyForm: Zustand Client State Management</CardTitle>
      </CardHeader>
      <CardContent>

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

      </CardContent>
    </Card>
  )
}

//  <div className="flex flex-row space-y-1">
export default NftBuyForm;