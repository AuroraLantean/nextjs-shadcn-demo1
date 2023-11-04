'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { web3InputSchema } from '@/lib/validators';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useToast } from '../ui/use-toast';
import { capitalizeFirst, makeShortAddr, parseFloatSafe } from '@/lib/utils';
import { APP_WIDTH_MIN, chainTypeDefault, nftIdMax, nftIdMin } from '@/constants/site_data';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { getBaseURI, getCurrBalances, getSalesPrices, initBalancesDefault, updateAddrs, updateNftArray, updateNftStatus, useWeb3Store } from '@/store/web3Store';
import { useShallow } from 'zustand/react/shallow';

type Props = {}

const NftSalesOutput = (props: Props) => {
  const lg = console.log;
  const compoName = 'NftSalesOutput';
  lg(compoName + '...');
  const initStates = { ...initBalancesDefault, str1: '' };
  //let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] }
  const effectRan = useRef(false)
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  //const [states, setStates] = useState<typeof initStates>(initStates);
  const [isLoading, setIsLoading] = useState(false);
  const nativeTokenName = 'ETH'
  const tokenName = 'USDT'

  const { chainType, isInitialized, chainName, chainId, account, err, tokenAddr, nftAddr, salesAddr, accBalcNative, accBalcToken, nftOriginalOwner,
    accNftArray, salesBalcNative, salesBalcToken,
    salesNftArray } = useWeb3Store(
      useShallow((state) => ({ ...state }))
    )

  useEffect(() => {
    setIsClient(true);
    if (effectRan.current === true) {
      lg(compoName + " useEffect ran on initialized:", isInitialized)

      const getInit2 = async () => {
        const chainType = chainTypeDefault;
        lg("tokenAddr:", tokenAddr)
        const balcs = await getCurrBalances(chainType, account, tokenAddr, nftAddr, salesAddr);
        if (balcs.err) {
          console.error("balcs.err:", balcs.err)
          toast({ description: `${balcs.err}`, variant: 'destructive' })
          return;
        }
        lg("getInit2. account:", account)
        const statuses = await updateNftStatus(chainType, account, nftOriginalOwner, nftAddr, salesAddr, nftIdMin, nftIdMax);
        if (statuses.err) {
          console.error("updateNftStatus err:", statuses.err)
          toast({ description: `${statuses.err}`, variant: 'destructive' })
          return;
        }
        lg("statuses:", statuses.arr)
        //setStates({ ...states, ...balcs })
      }
      if (isInitialized) getInit2();
    }
    return () => {
      lg(compoName + " unmounted useeffect()...")
      effectRan.current = true
    }
  }, [isInitialized]);

  type InputT = z.infer<typeof web3InputSchema>;
  const form = useForm<InputT>({
    resolver: zodResolver(web3InputSchema),
    defaultValues: {
      enum1: "eth_ethereum",
      enum2: "getBalance",
      floatNum1: "",
      addr1: process.env.NEXT_PUBLIC_ETHEREUM_ADDR1 || "",
      addr2: process.env.NEXT_PUBLIC_ETHEREUM_ADDR2 || "",
    },
  });

  async function onSubmit(data: InputT) {
    console.log("onSubmit", data);
    setIsLoading(true)
    //if(!isInitialized)
    const balcs = await getCurrBalances(chainType, account, tokenAddr, nftAddr, salesAddr);
    //lg("balcs:", balcs)
    if (balcs.err) {
      console.error("balcs.err:", balcs.err)
      toast({ description: `${balcs.err}`, variant: 'destructive' })
    } else {
      toast({ description: `Success` })
    }
    setIsLoading(false)
  }

  return (
    <Card className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <CardHeader>
        <CardTitle>{compoName} {isClient ? Math.trunc(Math.random() * 10000) : 0}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">Chain: {chainName} {chainId}</p>
        <p className="break-words text-xl font-semibold">Account: {makeShortAddr(account)}</p>
        <p className='text-xl font-semibold'>Account {nativeTokenName} Balance: {accBalcNative}</p>
        <p className='text-xl font-semibold'>Account {tokenName} Balance: {accBalcToken}</p>
        <p className='text-xl font-semibold'>Account NFT(s): {accNftArray.toString() || "none"}</p>

        <p className='text-xl'>Sales Contract: {makeShortAddr(salesAddr)}</p>
        <p className='text-xl'>Sales Contract {nativeTokenName} Balance: {salesBalcNative}</p>
        <p className='text-xl'>Sales Contract {tokenName} Balance: {salesBalcToken}</p>
        <p className='text-xl'>Sales Contract NFT(s): {salesNftArray.toString() || "none"}</p>

        <p className='text-xl font-semibold break-words mb-3'>Output: { }</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-1"
          >

            <FormField
              control={form.control}
              name="enum2"
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
                            <RadioGroupItem value="readEthBalc" />
                          </FormControl>
                          <FormLabel>
                            Read Balances
                          </FormLabel>
                        </FormItem>

                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            <Button className='!bg-primary-500 mt-5' type="submit" isLoading={isLoading} >Go</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default NftSalesOutput;