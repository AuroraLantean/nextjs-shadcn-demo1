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
import { tokenOnChains, web3InputSchema } from '@/lib/validators';
import { makeShortAddr, cn } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { initializeWallet, updateNftStatus, useWeb3Store } from '@/store/web3Store';
import { OutT, bigIntZero, buyNFTviaERC20, buyNFTviaETH, erc20Approve, erc20BalanceOf, erc20Data, erc20Transfer, erc721BalanceOf, erc721SafeMint, erc721TokenIds, erc721Transfer, getBalanceEth, getDecimals, getEvmAddr } from '@/lib/actions/ethers';
import { buyNFT } from '@/lib/actions/radix.actions';
import { useShallow } from 'zustand/react/shallow'
import { APP_WIDTH_MIN, chainTypeDefault } from '@/constants/site_data';
import { Separator } from '../ui/separator';

type Props = {}
//web3 wallet connection should be initialized via another React componenet on the same page
const Web3Form = (props: Props) => {
  const lg = console.log;
  const compoName = 'Web3Form'
  lg(compoName + "...")
  const effectRan = useRef(false)
  const { toast } = useToast();
  let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] as number[] }
  const initStates = { ...out, isLoading: false };
  const [outputs, setOutputs] = useState<typeof initStates>(initStates);

  const { chainType, isInitialized, chainName, chainId, account, nftOriginalOwner, nftAddr, tokenAddr, salesAddr, nftIds, tokenSymbol, prices, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )

  const tokenSelectionStr = tokenSymbol + ' on Ethereum';
  const inputTokens = [
    { label: "ETH on Ethereum", value: tokenOnChains[0] },
    { label: tokenSelectionStr, value: tokenOnChains[1] },
    { label: "GoldCoin on Ethereum", value: tokenOnChains[2] },
    { label: "XRD on Radix", value: tokenOnChains[3] },
    { label: "USDT on Radix", value: tokenOnChains[4] },
  ];// as const;

  const addr1def = process.env.NEXT_PUBLIC_ETHEREUM_ADDR1 || "";
  const addr2def = process.env.NEXT_PUBLIC_ETHEREUM_ADDR2 || "";

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
    if (data.enum1 === tokenOnChains[0]) {

      if (data.enum2 === "getBalance") {
        out = await getBalanceEth(addr1)
      } else if (data.enum2 === "transfer") {

      } else {

      }

    } else if (data.enum1 === tokenOnChains[1]) {
      //usdt_ethereum
      if (data.enum2 === "getBalance") {
        const decimals = getDecimals(tokenAddr);
        out = await erc20BalanceOf(addr1, decimals, tokenAddr)

      } else if (data.enum2 === "transfer") {
        if (!addr2) {
          addr2 = salesAddr
        }
        const decimals = getDecimals(tokenAddr);
        out = await erc20Transfer(addr2, outFloat + '', decimals, tokenAddr);

      } else if (data.enum2 === "approve") {
        lg("addr1", addr1)
        if (!addr2) {
          addr2 = salesAddr
        }
        const decimals = getDecimals(tokenAddr);
        out = await erc20Approve(addr2, outFloat + '', decimals, tokenAddr);

      } else if (data.enum2 === "mintTokens") {
        //out = await erc20SafeMint(addr2, parseInt(outFloat), tokenAddr);
      }

    } else if (data.enum1 === tokenOnChains[2]) {
      //goldcoin_ethereum
      if (data.enum2 === "getBalance") {
        out = await erc721TokenIds(addr1, tokenAddr);
      }

    } else if (data.enum1 === tokenOnChains[3]) {
      //nftDragon_ethereum
      if (!addr1) {
        out = { ...out, err: "Invalid addr1" }
      }
      //out = await erc721Transfer(addr1!, addr1, outFloat, addr1);
    } else if (data.enum1 === tokenOnChains[4]) {
    } else if (data.enum1 === tokenOnChains[5]) {
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
        <p className="text-xl font-semibold">Detected Chain: {chainName}, Id: {chainId}</p>
        <p className="break-words text-xl font-semibold">Account: {makeShortAddr(account)}</p>
        <p className='text-xl font-semibold break-words'>Outputs numbers: {outputs.nums}</p>
        <p className='text-xl font-semibold'>Error: {outputs.err}</p>
        <p className='text-xl font-semibold break-words mb-3'>Output: {outputs.str1}</p>

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
                  <FormLabel>Input Token</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[270px] justify-between",
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
                            <RadioGroupItem value="mintOneNFT" />
                          </FormControl>
                          <FormLabel>
                            MintOneNFT
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="mintTokens" />
                          </FormControl>
                          <FormLabel>
                            MintTokens
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
            <Button className='!bg-primary-500 mt-5' type="submit" isLoading={outputs.isLoading} >Submit to Blockchain</Button>
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