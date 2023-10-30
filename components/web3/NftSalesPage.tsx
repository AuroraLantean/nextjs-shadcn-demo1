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
import { OutT, initBalancesDefault, bigIntZero, erc20BalanceOf, erc20Transfer, erc721BalanceOf, erc721TokenIds, erc721Transfer, ethersInit, getBalanceEth, getCurrBalances, getChainObj, getCtrtAddr, checkNftStatus } from '@/lib/actions/ethers';
import { APP_WIDTH_MIN, dragons } from '@/constants/site_data';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { updateNftStatus, useWeb3Store } from '@/store/web3Store';
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
  const usdtAddr = getCtrtAddr('usdt')
  const erc721DragonAddr = getCtrtAddr('erc721Dragon')
  const erc721SalesAddr = getCtrtAddr('erc721Sales')
  const nftOwner = process.env.NEXT_PUBLIC_ETHEREUM_NFTOWNER || '';
  //lg('nftOwner', nftOwner);

  const { chainType, isInitialized, chainName, chainId, account, isLoadingWeb3, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )

  useEffect(() => {
    setIsClient(true);
    if (effectRan.current === true) {
      lg(compoName + " useEffect ran on initialized:", isInitialized)
      lg(compoName + '. usdt:', usdtAddr, ', erc721Dragon:', erc721DragonAddr, ', erc721Sales:', erc721SalesAddr);
      if (!nftOwner) {
        let mesg = "env nftOwner invalid";
        console.warn(mesg)
      }

      const getInit2 = async () => {
        const balcs = await getCurrBalances(account, usdtAddr, erc721DragonAddr, erc721SalesAddr);
        //lg("balcs:", balcs)
        if (balcs.err) {
          console.error("balcs.err:", balcs.err)
          toast({ description: `${balcs.err}`, variant: 'destructive' })
        }
        const statuses = await updateNftStatus('evm', account, nftOwner, erc721DragonAddr, erc721SalesAddr, dragons[0].id, dragons[dragons.length - 1].id);
        if (statuses.err) {
          console.error("status err:", statuses.err)
          toast({ description: `${statuses.err}`, variant: 'destructive' })
        }
        lg("statuses:", statuses.arr)

        setStates({ ...states, tokenCtrt: usdtAddr, nftCtrt: erc721DragonAddr, salesCtrt: erc721SalesAddr, ...balcs })
      }
      if (isInitialized) getInit2();
    }
    return () => {
      lg(compoName + " unmounted useeffect()...")
      effectRan.current = true
    }
  }, [isInitialized]);

  const getBalances1 = async () => {
    console.log("getBalances1");
    const balcs = await getCurrBalances(account, usdtAddr, erc721DragonAddr, erc721SalesAddr);
    if (balcs.err) {
      console.error("balcs.err:", balcs.err)
      toast({ description: `${balcs.err}`, variant: 'destructive' })
    }
    setStates({ ...states, ...balcs })
  }
  const checkNftStatus1 = async () => {

  }

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
    const user = account;
    const oUserEth = await getBalanceEth(user);
    const erc20Addr = getCtrtAddr('usdt');
    const oUserTok = await erc20BalanceOf(user, erc20Addr)
    const erc721Addr = getCtrtAddr('erc721Dragon');
    const oUserNftIds = await erc721TokenIds(user, erc721Addr);

    const salesAddr = getCtrtAddr('erc721Sales');
    const oSalesEth = await getBalanceEth(salesAddr);
    const oSalesTok = await erc20BalanceOf(salesAddr, erc20Addr)
    const oSalesNftIds = await erc721TokenIds(salesAddr, erc721Addr);

    if (oUserEth.err || oUserTok.err || oUserNftIds.err || oSalesEth.err || oSalesTok.err || oSalesNftIds.err) {
      toast({ description: `${oUserTok.err},${oUserNftIds.err},${oSalesTok.err},${oSalesNftIds.err},${oUserEth.err},${oSalesEth.err}`, variant: 'destructive' })
    } else {
      toast({ description: `Success` })
      setStates({ ...states, accBalcNative: oUserEth.str1, accBalcToken: oUserTok.str1, accNftArray: oUserNftIds.nums, salesBalcNative: oSalesEth.str1, salesBalcToken: oSalesTok.str1, salesNftArray: oSalesNftIds.nums })
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

        <Button className='!bg-primary-500 mt-5' onClick={getBalances1} isLoading={isLoading} >Check Balances</Button>
      </CardContent>
    </Card>
  )
}

export default NftSalesPage;
