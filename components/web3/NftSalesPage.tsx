'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import z, { number } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { web3InputSchema } from '@/lib/validators';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useToast } from '../ui/use-toast';
import { capitalizeFirst, makeShortAddr, parseFloatSafe } from '@/lib/utils';
import { OutT, bigIntZero, erc20BalanceOf, erc20Transfer, erc721BalanceOf, erc721TokenIds, erc721Transfer, ethersInit, getBalanceEth, getEvmBalances, getChainObj, checkNftStatus } from '@/lib/actions/ethers';
import { APP_WIDTH_MIN, dragons } from '@/constants/site_data';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { getCurrBalances, initBalancesDefault, updateCtrtAddrs, updateNftStatus, useWeb3Store } from '@/store/web3Store';
import { useShallow } from 'zustand/react/shallow';

type Props = {}

const NftSalesPage = (props: Props) => {
  const lg = console.log;
  const compoName = 'NftSalesPage';
  lg(compoName + '...');
  const initStates = { ...initBalancesDefault, salesCtrt: '', tokenCtrt: '', nftCtrt: '', chainName: '', chainId: '', account: '', str1: '' };
  let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] }
  const effectRan = useRef(false)
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [states, setStates] = useState<typeof initStates>(initStates);
  const [isLoading, setIsLoading] = useState(false);
  const nativeTokenName = 'ETH'
  const tokenName = 'USDT'
  let usdtAddr = '', nftAddr = '', salesAddr = '';
  const nftOwner = process.env.NEXT_PUBLIC_ETHEREUM_NFTOWNER || '';
  //lg('nftOwner', nftOwner);

  const { chainType, isInitialized, chainName, chainId, account, isLoadingWeb3, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )

  useEffect(() => {
    setIsClient(true);
    if (effectRan.current === true) {
      lg(compoName + " useEffect ran on initialized:", isInitialized)
      if (!nftOwner) {
        let mesg = "env nftOwner invalid";
        console.warn(mesg)
      }

      const getInit2 = async () => {
        const { usdtAddr, nftAddr, salesAddr } = await updateCtrtAddrs(chainType);

        const balcs = await getCurrBalances(chainType, account, usdtAddr, nftAddr, salesAddr);
        if (balcs.err) {
          console.error("balcs.err:", balcs.err)
          toast({ description: `${balcs.err}`, variant: 'destructive' })
          return;
        }

        const statuses = await updateNftStatus(chainType, account, nftOwner, nftAddr, salesAddr, dragons[0].id, dragons[dragons.length - 1].id);
        if (statuses.err) {
          console.error("status err:", statuses.err)
          toast({ description: `${statuses.err}`, variant: 'destructive' })
          return;
        }
        lg("statuses:", statuses.arr)

        setStates({ ...states, tokenCtrt: usdtAddr, nftCtrt: nftAddr, salesCtrt: salesAddr, ...balcs })
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
    //if(!isInitialized)
    const balcs = await getCurrBalances(chainType, account, usdtAddr, nftAddr, salesAddr);
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
        <CardTitle>NFT Sales {isClient ? Math.trunc(Math.random() * 10000) : 0}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">Chain: {chainName} {chainId}</p>
        <p className="break-words text-xl font-semibold">Account: {makeShortAddr(account)}</p>
        <p className='text-xl font-semibold'>Account {nativeTokenName} Balance: {states.accBalcNative}</p>
        <p className='text-xl font-semibold'>Account {tokenName} Balance: {states.accBalcToken}</p>
        <p className='text-xl font-semibold'>Account NFT(s): {states.accNftArray.toString() || "none"}</p>

        <p className='text-xl'>Sales Contract: {makeShortAddr(states.salesCtrt)}</p>
        <p className='text-xl'>Sales Contract {nativeTokenName} Balance: {states.salesBalcNative}</p>
        <p className='text-xl'>Sales Contract {tokenName} Balance: {states.salesBalcToken}</p>
        <p className='text-xl'>Sales Contract NFT(s): {states.salesNftArray.toString() || "none"}</p>

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

export default NftSalesPage;
