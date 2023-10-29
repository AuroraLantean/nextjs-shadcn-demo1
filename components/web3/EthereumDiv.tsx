'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { web3InputSchema } from '@/lib/validators';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { makeShortAddr, parseFloatSafe } from '@/lib/utils';
import goldcoin from '@/web3ABIs/ethereum/goldcoin.json';
import dragonNft from '@/web3ABIs/ethereum/erc721Dragon.json';
import { OutT, bigIntZero, erc20BalanceOf, erc20Transfer, erc721BalanceOf, erc721SafeMint, erc721TokenIds, erc721Transfer, getBalanceEth, getCtrtAddr } from '@/lib/actions/ethers';
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { initializeWallet, useWeb3Store } from '@/store/web3Store';
import { useShallow } from 'zustand/react/shallow';

type Props = {}

const EthereumDiv = (props: Props) => {
  const lg = console.log;
  lg('EthereumDiv. goldcoin addr:', goldcoin.address, ', dragonNft addr:', dragonNft.address);
  const initStates = { balcETH: '', balcToken: '', balcNFT: '', str1: '' };
  let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] }
  const effectRan = useRef(false)
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [states, setStates] = useState<typeof initStates>(initStates);
  const [isLoading, setIsLoading] = useState(false);
  const { chainType, isInitialized, chainName, chainId, account, isLoadingWeb3, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )

  const connectToWallet = async () => {
    lg("connectToWallet")
    if (isInitialized) {
      lg("already initialized")
      toast({ description: "web3 already initialized" });
    } else {
      const initOut = await initializeWallet('evm');
      //const initOut = await ethersInit();
      if (initOut.err) {
        toast({ description: `Failed: ${JSON.stringify(initOut.err)}`, variant: 'destructive' })
        return true;
      }
      if (initOut.warn) {
        toast({ description: `Failed: ${JSON.stringify(initOut.warn)}`, variant: 'destructive' })
        return true;
      }
      toast({ description: "web3 initialized successfully!" });
      lg("initOut:", initOut)
    }
  }

  useEffect(() => {
    setIsClient(true);
    if (effectRan.current === true) {
      console.log("EthereumDiv useEffect ran")
      connectToWallet();
    }
    return () => {
      lg("EthereumDiv unmounted useeffect()...")
      effectRan.current = true
    }
  }, []);

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
    /* { balcETH,  balcToken, balcNFT } = states */
    let addr = ''
    if (data.enum1 === "account") {
      addr = account
    } else {
      addr = getCtrtAddr(data.enum1)
    }

    if (data.enum2 === "readEthBalc") {
      out = await getBalanceEth(addr)
      setStates({ ...states, balcETH: out.str1 })

    } else if (data.enum2 === "readTokenBalc") {
      if (!data.addr1) {
        out = { ...out, err: "Invalid addr1" }
      } else if (data.enum1 === "usdt") {
        out = await erc20BalanceOf(data.addr1, addr)
        setStates({ ...states, balcETH: out.str1 })

      } else if (data.enum1 === "erc721Dragon") {
        out = await erc721BalanceOf(data.addr1, addr)
        setStates({ ...states, balcETH: out.str1 })

      } else {
        out = { ...out, err: "Invalid contract choice" }
      }
      /* { balcETH,  balcToken, balcNFT } = states */
    } else if (data.enum2 === "transfer") {

      if (!data.addr2) {
        out = { ...out, err: "Invalid addr2" }

      } else if (data.enum1 === "usdt") {
        out = await erc20Transfer(data.addr2, data.floatNum1, addr);

      } else if (data.enum1 === "erc721Dragon") {
        out = await erc721Transfer(data.addr1!, data.addr2, data.floatNum1, addr);
      } else {
        out = { ...out, err: "invalid func 102" }
      }
    } else if (data.enum2 === "getNFTs") {
      out = await erc721TokenIds(data.addr1!, addr);

    } else if (data.enum2 === "mintOneNFT") {
      out = await erc721SafeMint(account, data.addr2!, data.floatNum1, addr);

    } else if (data.enum2 === "transferFrom") {
      /*txnIn= { ctrtAddr, addr1, addr2, amount1, amount2 };
       { balcETH,  balcToken, balcNFT } = states */

    } else if (data.enum2 === "allowance") {

    } else {
      console.warn("Invalid enum2")
      out = { ...out, err: "Invalid enum2" }
    }
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
        <CardTitle>Ethereum Related Chains {isClient ? Math.trunc(Math.random() * 10000) : 0}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">Detected Chain: {chainName}, Id: {chainId}</p>
        <p className="break-words text-xl font-semibold">Account: {makeShortAddr(account)}</p>
        <p className='text-xl font-semibold'>ETH Balance on address: {states.balcETH}</p>
        <p className='text-xl font-semibold break-words mb-3'>Output: {states.str1}</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-1"
          >

            <FormField
              control={form.control}
              name="enum1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified contract to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="account">Current Account</SelectItem>
                      <SelectItem value="goldCoin">GoldCoin</SelectItem>
                      <SelectItem value="erc721Dragon">Dragon NFT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
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
                            Read Balance
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

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="transfer" />
                          </FormControl>
                          <FormLabel>
                            Transfer
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="transferFrom" />
                          </FormControl>
                          <FormLabel>
                            TransferFrom
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="allowance" />
                          </FormControl>
                          <FormLabel>
                            Allowance
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="mintOneNFT" />
                          </FormControl>
                          <FormLabel>
                            MintOneNFT
                          </FormLabel>
                        </FormItem>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* floatNum1 */}
            <FormField
              control={form.control}
              name="floatNum1"
              render={({ field }) => (
                <FormItem>
                  <h3>Amount in Ether</h3>
                  <FormControl>
                    <Input
                      placeholder="Enter floatNum1..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* addr1 */}
            <FormField
              control={form.control}
              name="addr1"
              render={({ field }) => (
                <FormItem>
                  <h3>Addr1</h3>
                  <FormControl>
                    <Input
                      placeholder="Enter addr1..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* addr2 */}
            <FormField
              control={form.control}
              name="addr2"
              render={({ field }) => (
                <FormItem>
                  <h3>Addr2</h3>
                  <FormControl>
                    <Input
                      placeholder="Enter addr2..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <Button className='!bg-primary-500 mt-5' type="submit" isLoading={isLoading} >Submit to Blockchain</Button>
          </form>
        </Form>

      </CardContent>
    </Card>
  )
}

export default EthereumDiv;
