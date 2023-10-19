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
import { toast, useToast } from '../ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { capitalizeFirst, makeAddr, parseFloatSafe } from '@/lib/utils';
import goldcoin from '@/web3ABIs/ethereum/goldcoin.json';
import dragonNft from '@/web3ABIs/ethereum/erc721Dragon.json';
import { OutT, TxnInT, bigIntZero, erc20BalanceOf, erc20Transfer, erc721BalanceOf, erc721Transfer, ethersInit, getBalanceEth, getChainObj, getCtrtAddr, txnIn } from '@/lib/ethers';
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

type Props = {}

const EthereumDiv = (props: Props) => {
  const lg = console.log;
  lg('EthereumDiv. goldcoin addr:', goldcoin.address, ', dragonNft addr:', dragonNft.address);
  const initStates = {
    chainName: '', chainId: '', account: '',
    balcETH: '', balcToken: '', balcNFT: '', txnHash: ''
  };
  let out: OutT = { err: '', inEth: '', inWei: bigIntZero, txnHash: '' }
  const effectRan = useRef(false)
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [states, setStates] = useState<typeof initStates>(initStates);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("useEffect ran")
    if (effectRan.current === true) {
      setIsClient(true);
      const initRun = async () => {
        const initOut = await ethersInit();
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
        const { chainHex, chainStr } = getChainObj(initOut.chainId!)
        setStates({
          ...states,
          chainName: capitalizeFirst(chainStr),
          chainId: initOut.chainId!,
          account: initOut.account!,
        })
      }
      initRun()
    }
    return () => {
      lg("unmounted useeffect()...")
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
    /* {chainName, chainId, account, balcETH,  balcToken, balcNFT } = states */
    let addr = ''
    if (data.enum1 === "account") {
      addr = states.account
    } else {
      addr = getCtrtAddr(data.enum1)
    }

    if (data.enum2 === "readEthBalc") {
      out = await getBalanceEth(addr)
      setStates({ ...states, balcETH: out.inEth })

    } else if (data.enum2 === "readTokenBalc") {
      if (!data.addr1) {
        out = { ...out, err: "Invalid addr1" }
      } else if (data.enum1 === "goldCoin") {
        out = await erc20BalanceOf({ addrTarget: data.addr1, addrCtrt: addr })
        setStates({ ...states, balcETH: out.inEth })

      } else if (data.enum1 === "erc721Dragon") {
        out = await erc721BalanceOf({ addrTarget: data.addr1, addrCtrt: addr })
        setStates({ ...states, balcETH: out.inEth })

      } else {
        out = { ...out, err: "Invalid contract choice" }
      }
      /* {chainName, chainId, account, balcETH,  balcToken, balcNFT } = states */
    } else if (data.enum2 === "transfer") {

      if (!data.addr2) {
        out = { ...out, err: "Invalid addr2" }

      } else if (data.enum1 === "goldCoin") {
        out = await erc20Transfer({ ...txnIn, addr2: data.addr2, amount1: data.floatNum1, ctrtAddr: addr });

      } else if (data.enum1 === "erc721Dragon") {
        out = await erc721Transfer({ ...txnIn, addr1: data.addr1!, addr2: data.addr2, amount1: data.floatNum1, ctrtAddr: addr });
      } else {
        out = { ...out, err: "invalid func 102" }
      }
    } else if (data.enum2 === "transferFrom") {
      /*  txnIn= { chainName, ctrtAddr, addr1, addr2, amount1, amount2 };
       {chainName, chainId, account, balcETH,  balcToken, balcNFT } = states */

    } else if (data.enum2 === "allow") {

    } else {
      console.warn("Invalid enum2")
      out = { ...out, err: "Invalid enum2" }
    }
    lg("out:", out)
    if (out.err) {
      toast({ description: `Failed: ${out.err}`, variant: 'destructive' })
    } else {
      toast({ description: `Success ${out.inEth} ${out.txnHash}` })
      if (out.txnHash) setStates({ ...states, txnHash: out.txnHash })
    }
    setIsLoading(false)
  }

  return (
    <Card className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <CardHeader>
        <CardTitle>Ethereum Related Chains {isClient ? Math.trunc(Math.random() * 10000) : 0}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">Detected Chain: {states.chainName}</p>
        <p className="break-words text-xl font-semibold">Account: {makeAddr(states.account)}</p>
        <p className='text-xl font-semibold'>ETH Balance on address: {states.balcETH}</p>
        <p className='text-xl font-semibold break-words mb-3'>TxnHash: {states.txnHash}</p>

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
                            <RadioGroupItem value="allow" />
                          </FormControl>
                          <FormLabel>
                            Allow
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
