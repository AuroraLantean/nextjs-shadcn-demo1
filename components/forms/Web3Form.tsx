"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tokenOnChain, tokenOnChains, tokenT, web3InputSchema } from '@/lib/validators';
import { makeShortAddr, cn, isEmpty } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { initializeWallet, updateNftStatus, useWeb3Store } from '@/store/web3Store';
import { OutT, addr2def, bigIntZero, buyNFTviaERC20, buyNFTviaETH, erc20Allowance, erc20Approve, erc20BalanceOf, erc20Data, erc20MintToGuest, erc20Transfer, erc721BalanceOf, erc721SafeMint, erc721SafeMintToGuest, erc721TokenIds, erc721Transfer, ethBalanceOf, ethTransfer, getDecimals, getEvmAddr, salesPrice, salesSetPriceBatchGuest } from '@/lib/actions/ethers';
import { buyNFT } from '@/lib/actions/radix.actions';
import { useShallow } from 'zustand/react/shallow'
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { Separator } from '../ui/separator';

type Props = {}
//web3 wallet connection should be initialized via another React componenet on the same page
const Web3Form = (props: Props) => {
  const lg = console.log;
  const compoName = 'Web3Form'
  lg(compoName + "...")
  const effectRan = useRef(false)
  const { toast } = useToast();
  let mesg = ''
  let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] as number[] }
  const initStates = { ...out, isLoading: false };
  const [outputs, setOutputs] = useState<typeof initStates>(initStates);
  const [inputTokens, setInputTokens] = useState<tokenT[]>([]);
  const { chainName, chainId, account, nftAddr, tokenAddr, salesAddr, nativeAssetSymbol, tokenSymbol, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )
  const blockchain = process.env.NEXT_PUBLIC_BLOCKCHAIN;
  //lg('--------', compoName, chainName, 'nativeAssetSymbol:', nativeAssetSymbol, 'tokenSymbol:', tokenSymbol)
  useEffect(() => {
    lg(compoName + " useEffect runs, blockchain:", blockchain)
    if (blockchain || effectRan.current === true) {
      lg('------', compoName, chainName, nativeAssetSymbol, tokenSymbol)
      if (chainName && nativeAssetSymbol && tokenSymbol) {
        setInputTokens([
          { label: nativeAssetSymbol + " on " + chainName, value: tokenOnChains[0] },
          { label: tokenSymbol + " on " + chainName, value: tokenOnChains[1] },
          { label: "GoldCoin on " + chainName, value: tokenOnChains[2] },
          { label: "DragonNFT on " + chainName, value: tokenOnChains[3] },
          { label: "Sales Contract on " + chainName, value: tokenOnChains[4] },
          { label: "XRD on Radix", value: tokenOnChains[5] },
          { label: "USDT on Radix", value: tokenOnChains[6] },
        ]);// as const;
        lg("inputTokens:", inputTokens)
      }
    }
    return () => {
      lg(compoName + " unmounted useEffect()...")
      effectRan.current = true
    }
  }, [chainName, nativeAssetSymbol, tokenSymbol]);


  type InputT = z.infer<typeof web3InputSchema>;
  const form = useForm<InputT>({
    resolver: zodResolver(web3InputSchema),
    defaultValues: {
      enum1: tokenOnChains[0],
      enum2: "getBalance",
      floatNum1: "0.001",
      addr1: '',
      addr2: '',
    },
  });
  async function onSubmit(data: InputT) {
    console.log("onSubmit", data);
    setOutputs(prev => ({ ...prev, isLoading: true }))
    //alert(JSON.stringify(data, null, 4));

    const outFloat = Number.parseFloat(data.floatNum1);
    if (Number.isNaN(outFloat)) {
      console.error('floatNum1 invalid');
      toast({ description: `Error: floatNum1 invalid`, variant: 'destructive' })
      setOutputs(prev => ({ ...prev, isLoading: false }))
      return true;
    }
    let addr1 = data.addr1;
    let addr2 = data.addr2;
    lg("data.enum1:", data.enum1, ", data.enum2:", data.enum2)
    if (!addr1) {
      addr1 = account;
    }
    if (!addr2) {
      if (isEmpty(addr2def)) console.error("Invalid addr2def");
      addr2 = addr2def;
    }
    const decimals = getDecimals(tokenAddr);
    lg("addr1", addr1, ', addr2:', addr2)
    if (data.enum1 === tokenOnChains[0]) {
      if (data.enum2 === "getBalance") {
        out = await ethBalanceOf(addr1)
      } else if (data.enum2 === "transfer") {
        if (addr2 === salesAddr) {
          addr2 = addr2def;
        }
        out = await ethTransfer(addr2, outFloat + '', chainName);
      }

    } else if (data.enum1 === tokenOnChains[1]) {
      //usdt_ethereum
      if (data.enum2 === "getBalance") {
        out = await erc20BalanceOf(addr1, decimals, tokenAddr)

      } else if (data.enum2 === "transfer") {
        out = await erc20Transfer(addr2, outFloat + '', decimals, tokenAddr);

      } else if (data.enum2 === "approve") {
        out = await erc20Approve(addr2, outFloat + '', decimals, tokenAddr);

      } else if (data.enum2 === "allowance") {
        out = await erc20Allowance(addr1, addr2, tokenAddr, decimals);

      } else if (data.enum2 === "mintTokensToGuest") {
        out = await erc20MintToGuest(tokenAddr);
      }

    } else if (data.enum1 === tokenOnChains[2]) {
      //goldcoin_ethereum

    } else if (data.enum1 === tokenOnChains[3]) {
      //nftDragon_ethereum
      const nftId = Number.parseInt(data.floatNum1);
      if (Number.isNaN(nftId)) {
        console.error('floatNum1 should be an integer');
        toast({ description: `Error: The numeral should be an integer`, variant: 'destructive' })
        setOutputs(prev => ({ ...prev, isLoading: false }))
        return true;
      }
      if (data.enum2 === "getBalance") {
        out = await erc721TokenIds(addr1, nftAddr);

      } else if (data.enum2 === "transfer") {
        out = await erc721Transfer(addr1, addr2, data.floatNum1, nftAddr);

      } else if (data.enum2 === "approve") {

      } else if (data.enum2 === "mintNftToSales") {
        out = await erc721SafeMintToGuest(salesAddr, data.floatNum1, nftAddr);
      }

    } else if (data.enum1 === tokenOnChains[4]) {
      //sales_ethereum
      const nftId = Number.parseInt(data.floatNum1);
      if (Number.isNaN(nftId)) {
        console.error('floatNum1 should be an integer');
        toast({ description: `Error: The numeral should be an integer`, variant: 'destructive' })
        setOutputs(prev => ({ ...prev, isLoading: false }))
        return true;
      }
      out = await salesPrice(nftId, nftAddr, salesAddr, decimals);
      if (out.err) {
        mesg = 'salesPrice failed: ' + out.err;
        console.error(mesg);
        toast({ description: mesg, variant: 'destructive' })
        setOutputs(prev => ({ ...prev, isLoading: false }))
        return true;
      }
      const priceNative = out.str1.split('_')[0];
      const priceToken = out.str1.split('_')[1].replace('.0', '');
      lg('prices:', priceNative, priceToken)

      if (data.enum2 === "setPriceBatchGuest") {
        out = await salesSetPriceBatchGuest(nftAddr, nftId, salesAddr);

      } else if (data.enum2 === "buyNftviaNative") {
        if (parseFloat(priceNative) === 0) {
          mesg = 'priceNative should not be zero'
          console.error(mesg);
          toast({ description: mesg, variant: 'destructive' })
          setOutputs(prev => ({ ...prev, isLoading: false }))
          return true;
        }
        out = await buyNFTviaETH(nftAddr, nftId + '', priceNative, salesAddr, account);

      } else if (data.enum2 === "buyNftviaToken") {
        if (parseFloat(priceToken) === 0) {
          mesg = 'priceToken should not be zero'
          console.error(mesg);
          toast({ description: mesg, variant: 'destructive' })
          setOutputs(prev => ({ ...prev, isLoading: false }))
          return true;
        }
        out = await buyNFTviaERC20(nftAddr, nftId, salesAddr, account, tokenAddr, priceToken);
      }
    } else if (data.enum1 === tokenOnChains[5]) {
      //xrd_radix

    } else if (data.enum1 === tokenOnChains[6]) {
      //usdt_radix

    } else {
      out = { ...out, err: "Invalid enum1" }
    }

    lg("out:", out)
    if (out.err) {
      toast({ description: `Failed: ${out.err}`, variant: 'destructive' })
    } else {
      toast({ description: `Success ${out.str1}` })
    }
    setOutputs(prev => ({ ...prev, ...out, isLoading: false }))
  }
  //{isClient ? Math.trunc(Math.random() * 10000) : 0}
  return (
    <Card className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <CardHeader>
        <CardTitle>Web3Form</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-xl font-semibold break-all mb-3'>
          <p>Detected Chain: {chainName}, Id: {chainId}</p>
          <p>Account: {makeShortAddr(account)}</p>
          <p>Outputs numbers: {outputs.nums}</p>
          <p>Error: {outputs.err}</p>
          <p>Output: {outputs.str1}</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-1"
          >

            <FormField
              control={form.control}
              name="enum1"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Token/Contract:</FormLabel>
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
                                form.setValue("enum1", inputToken.value)
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
                            Get Balance
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="allowance" />
                          </FormControl>
                          <FormLabel>
                            Get Allowance
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
                            <RadioGroupItem value="approve" />
                          </FormControl>
                          <FormLabel>
                            Approve
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="mintTokensToGuest" />
                          </FormControl>
                          <FormLabel>
                            Mint Tokens To Guest
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="mintNftToSales" />
                          </FormControl>
                          <FormLabel>
                            Mint NFTs to Sales Contract
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="setPriceBatchGuest" />
                          </FormControl>
                          <FormLabel>
                            Set Price by Guest
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="buyNftviaNative" />
                          </FormControl>
                          <FormLabel>
                            Buy NFT via Native Asset
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="buyNftviaToken" />
                          </FormControl>
                          <FormLabel>
                            Buy NFT via Token
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
                  <h3>Amount in Ether / NFT ID</h3>
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
                      placeholder="keep this empty to use wallet account"
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
                      placeholder="keep this empty to use addr2def"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <Button className='!bg-orange-500 mt-5' type="submit" isLoading={outputs.isLoading} >Submit to Blockchain</Button>
          </form>
        </Form>

      </CardContent>
    </Card>
  )
}

export default Web3Form
/** Dropdown selection
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
 */