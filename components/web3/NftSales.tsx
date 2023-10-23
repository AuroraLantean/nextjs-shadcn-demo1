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
import goldcoin from '@/web3ABIs/ethereum/goldcoin.json';
import dragonNft from '@/web3ABIs/ethereum/erc721Dragon.json';
import { OutT, bigIntZero, erc20BalanceOf, erc20Transfer, erc721BalanceOf, erc721TokenIds, erc721Transfer, ethersInit, getBalanceEth, getChainObj, getCtrtAddr } from '@/lib/actions/ethers';
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useWeb3Store } from '@/store/web3Store';
import { useShallow } from 'zustand/react/shallow';

type Props = {}

const NftSales = (props: Props) => {
  const lg = console.log;
  lg('NftSales. goldcoin addr:', goldcoin.address, ', dragonNft addr:', dragonNft.address);
  const initStates = {
    chainName: '', chainId: '', account: '',
    accBalcNative: '', accBalcToken: '', accBalcNFT: '', accNftArray: [], salesCtrt: '', salesBalcNative: '', salesBalcToken: '', salesBalcNFT: '', salesNftArray: [], str1: ''
  };
  let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] }
  const effectRan = useRef(false)
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [states, setStates] = useState<typeof initStates>(initStates);
  const [isLoading, setIsLoading] = useState(false);
  const nativeTokenName = 'ETH'
  const tokenName = 'USDT'
  const { chainType, isInitialized, chainName, chainId, account, isLoadingWeb3, error } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )
  useEffect(() => {
    if (effectRan.current === true) {
      console.log("NftSales useEffect ran")
      setIsClient(true);
      const getInit2 = async () => {
        const out = await getBalanceEth(account)
        setStates({ ...states, accBalcNative: out.str1 })
      }
      getInit2();
    }
    return () => {
      lg("NftSales unmounted useeffect()...")
      effectRan.current = true
    }
  }, [isInitialized]);

  type InputT = z.infer<typeof web3InputSchema>;
  const form = useForm<InputT>({
    resolver: zodResolver(web3InputSchema),
    defaultValues: {
      enum1: "account",
      enum2: "readEthBalc",
      floatNum1: "",
      addr1: process.env.NEXT_PUBLIC_ETHEREUM_ADDR1 || "",
      addr2: process.env.NEXT_PUBLIC_ETHEREUM_ADDR2 || "",
    },
  });
  async function onSubmit(data: InputT) {
    console.log("onSubmit", data);
    setIsLoading(true)
    //alert(JSON.stringify(data, null, 4));
    const floatNum1 = parseFloatSafe(data.floatNum1);
    lg("out:", out)
    if (out.err) {
      toast({ description: `Failed: ${out.err}`, variant: 'destructive' })
    } else {
      toast({ description: `Success ${out.str1}` })
      if (out.str1) setStates({ ...states, str1: out.str1 })
    }
    setIsLoading(false)
  }

  return (
    <Card className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <CardHeader>
        <CardTitle>NFT Sales {isClient ? Math.trunc(Math.random() * 10000) : 0}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">Chain: {chainName} {chainId}</p>
        <p className="break-words text-xl font-semibold">Account: {makeShortAddr(account)}</p>
        <p className='text-xl font-semibold'>Account {nativeTokenName} Balance: {states.accBalcNative}</p>
        <p className='text-xl font-semibold'>Account {tokenName} Balance: {states.accBalcToken}</p>
        <p className='text-xl font-semibold'>Account NFT(s): {states.accBalcNFT} {states.accNftArray}</p>

        <p className='text-xl'>Sales Contract: {makeShortAddr(states.salesCtrt)}</p>
        <p className='text-xl'>Sales Contract {nativeTokenName} Balance: {states.salesBalcNative}</p>
        <p className='text-xl'>Sales Contract {tokenName} Balance: {states.salesBalcToken}</p>
        <p className='text-xl'>Sales Contract NFT(s): {states.salesBalcNFT} {states.salesNftArray}</p>

        <p className='text-xl font-semibold break-words mb-3'>Output: {states.str1}</p>

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
                            Read {nativeTokenName} Balance
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="getNFTs" />
                          </FormControl>
                          <FormLabel>
                            Get NFTs
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="readTokenBalc" />
                          </FormControl>
                          <FormLabel>
                            Read Token Balance
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
            <Button className='!bg-primary-500 mt-5' type="submit" isLoading={isLoading} >Read from Blockchain</Button>
          </form>
        </Form>

      </CardContent>
    </Card>
  )
}

export default NftSales;
