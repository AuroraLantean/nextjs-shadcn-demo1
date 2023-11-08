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
import { APP_WIDTH_MIN, nftIdMax, nftIdMin } from '@/constants/site_data';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { getBaseURI, getCurrBalances, getSalesPrices, initBalancesDefault, updateAddrs, updateNftArray, updateNftStatus, useWeb3Store } from '@/store/web3Store';
import { useShallow } from 'zustand/react/shallow';
import { addr1def, addr2def } from '@/lib/actions/ethers';

type Props = {}

const NftSalesOutput = (props: Props) => {
  const lg = console.log;
  const compoName = 'NftSalesOutput';
  lg(compoName + '...');
  const effectRan = useRef(false)
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { chainType, isInitialized, chainName, chainId, account, err, tokenAddr, nftAddr, salesAddr, accBalcNative, accBalcToken, nftOriginalOwner,
    accNftArray, salesBalcNative, salesBalcToken,
    salesNftArray, nativeAssetName, nativeAssetSymbol, nativeAssetDecimals, tokenName, tokenSymbol } = useWeb3Store(
      useShallow((state) => ({ ...state }))
    )

  useEffect(() => {
    lg(compoName + " useEffect runs")
    setIsClient(true);
    if (process.env.NEXT_PUBLIC_BLOCKCHAIN || effectRan.current === true) {

      const getInit2 = async () => {
        lg(compoName + " useEffect runs getInit2()")
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
      if (isInitialized && tokenAddr) getInit2();
    }
    return () => {
      lg(compoName + " unmounted useEffect()...")
      effectRan.current = true
    }
  }, [isInitialized, tokenAddr]);//tokenAddr arrives later than isInitialized from Wagmi

  type InputT = z.infer<typeof web3InputSchema>;
  const form = useForm<InputT>({
    resolver: zodResolver(web3InputSchema),
    defaultValues: {
      enum1: "eth_ethereum",
      enum2: "getBalance",
      floatNum1: "",
      addr1: addr1def,
      addr2: addr2def,
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
        <div className='text-xl font-semibold break-all mb-3'>
          <p>Chain: {chainName} {chainId}</p>
          <p>Account: {makeShortAddr(account)}</p>
          <p>Account {nativeAssetSymbol} Balance: {accBalcNative}</p>
          <p>Account {tokenSymbol} Balance: {accBalcToken}</p>
          <p>Account NFT(s): {accNftArray.toString() || "none"}</p>
        </div>

        <div className='text-xl break-all'>
          <p>Sales Contract: {makeShortAddr(salesAddr)}</p>
          <p>Sales Contract {nativeAssetSymbol} Balance: {salesBalcNative}</p>
          <p>Sales Contract {tokenSymbol} Balance: {salesBalcToken}</p>
          <p>Sales Contract NFT(s): {salesNftArray.toString() || "none"}</p>
        </div>

        <p className='text-xl font-semibold break-all mb-3'>Output: { }</p>

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
                            <RadioGroupItem value="getBalance" />
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
        <div className="break-all">
          <p>Deployed Contract Addresses</p>
          <p><span className='text-xl font-semibold'>Token:</span> {tokenAddr}</p>
          <p><span className='text-xl font-semibold'>NFT:</span> {nftAddr}</p>
          <p><span className='text-xl font-semibold'>Sales:</span> {salesAddr}</p>
        </div>
        <div className=''>
          <p className='text-xl font-semibold'>Click below to copy one of above addresses:</p>
          <div className='flex gap-2'>
            <Button className='!bg-primary-500 mt-5' onClick={() => { navigator.clipboard.writeText(tokenAddr) }}>Token</Button>
            <Button className='!bg-primary-500 mt-5' onClick={() => { navigator.clipboard.writeText(nftAddr) }}>NFT</Button>
            <Button className='!bg-primary-500 mt-5' onClick={() => { navigator.clipboard.writeText(salesAddr) }}>Sales</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NftSalesOutput;
