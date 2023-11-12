'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { tokenOnChains, web3InputSchema } from '@/lib/validators';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { cn, makeShortAddr, parseFloatSafe } from '@/lib/utils';
import { erc20Approve, erc20BalanceOf, erc20Data, erc20Transfer, erc721BalanceOf, erc721SafeMint, erc721TokenIds, erc721Transfer, ethBalanceOf, getDecimals, evmGetAddr } from '@/lib/actions/ethers';
import { APP_WIDTH_MIN, chainTypeDefault } from '@/constants/site_data';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { bigIntZero, initializeWallet, out, updateAddrs, useWeb3Store } from '@/store/web3Store';
import { useShallow } from 'zustand/react/shallow';

type Props = {}

const EthereumDiv = (props: Props) => {
  const lg = console.log;
  const compoName = 'EthereumDiv'
  lg(compoName + '...');
  const effectRan = useRef(false)
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initOutputs = out;
  const [outputs, setOutputs] = useState<typeof initOutputs>(initOutputs);

  const web3InitOut = { str1: '', inWei: bigIntZero, nums: [], err: '', name: '', symbol: '', decimals: -1, tokenSymbol: '', tokenAddr: '', salesAddr: '' };
  const [web3s, setWeb3s] = useState(web3InitOut);

  const { isInitialized, chainName, chainId, account, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )


  const connectToWallet = async () => {
    lg("connectToWallet")
    const chainType = chainTypeDefault;
    if (isInitialized) {
      lg("already initialized")
      toast({ description: "web3 already initialized" });
      return { ...web3InitOut }
    } else {
      const initOut = await initializeWallet(chainType);
      if (initOut.err) {
        toast({ description: `Failed: ${JSON.stringify(initOut.err)}`, variant: 'destructive' })
        return { ...web3InitOut, err: initOut.err };
      }
      if (initOut.warn) {
        toast({ description: `Failed: ${JSON.stringify(initOut.warn)}`, variant: 'destructive' })
        return { ...web3InitOut, err: initOut.warn };
      }
      toast({ description: "web3 initialized successfully!" });
      lg("initOut:", initOut)
      const { nftAddr, salesAddr, nftOriginalOwner, err: updateAddrsErr } = await updateAddrs(chainType);
      if (updateAddrsErr) {
        console.error("updateAddrsErr:", updateAddrsErr)
        toast({ description: `${updateAddrsErr}`, variant: 'destructive' })
        return { ...web3InitOut, err: updateAddrsErr };
      }
      const tokenAddr = evmGetAddr('erc20_usdt')
      const out1 = await erc20Data(tokenAddr);
      ;
      return { ...web3InitOut, tokenSymbol: out1.symbol, tokenAddr, salesAddr, tokenName: out1.name, decimals: out1.decimals };
    }
  }

  useEffect(() => {
    setIsClient(true);
    if (effectRan.current === true) {
      console.log("EthereumDiv useEffect ran")
      const run = async () => {
        const out1 = await connectToWallet();
        if (out1?.err) {
          console.error("connectToWallet failed. err:", out1.err)
          return;
        }
        setWeb3s({ ...web3s, ...out1 })
      }
      run();
    }
    return () => {
      lg("EthereumDiv unmounted useEffect()...")
      effectRan.current = true
    }
  }, []);
  //lg("EthereumDiv tokenSymbol:", web3s.tokenSymbol)
  const tokenSelectionStr = web3s.tokenSymbol + ' on Ethereum';
  const inputTokens = [
    { label: "ETH on Ethereum", value: tokenOnChains[0] },
    { label: tokenSelectionStr, value: tokenOnChains[1] },
    { label: "GoldCoin on Ethereum", value: tokenOnChains[2] },
    { label: "XRD on Radix", value: tokenOnChains[3] },
    { label: "USDT on Radix", value: tokenOnChains[4] },
  ];// as const;
  type InputT = z.infer<typeof web3InputSchema>;
  const form = useForm<InputT>({
    resolver: zodResolver(web3InputSchema),
    defaultValues: {
      enum1: tokenOnChains[0],
      enum2: "getBalance",
      floatNum1: "",
      addr1: '',
      addr2: '',
    },
  });
  async function onSubmit(data: InputT) {
    console.log("onSubmit", data);
    setIsLoading(true)
    //alert(JSON.stringify(data, null, 4));

    const outFloat = Number.parseFloat(data.floatNum1);
    if (Number.isNaN(outFloat)) {
      console.error('floatNum1 invalid');
      toast({ description: `Error: floatNum1 invalid`, variant: 'destructive' })
      setIsLoading(false)
      return true;
    }
    let addr1 = data.addr1;
    let addr2 = data.addr2;
    let outIds: number[] = []
    lg("data.enum1:", data.enum1, ", data.enum2:", data.enum2)
    let out1 = out;
    if (!addr1) {
      addr1 = account;
    }
    if (data.enum1 === tokenOnChains[0]) {

      if (data.enum2 === "getBalance") {
        out1 = await ethBalanceOf(addr1)
      }

    } else if (data.enum1 === tokenOnChains[1]) {
      //usdt_ethereum
      if (data.enum2 === "getBalance") {
        const decimals = getDecimals(web3s.tokenAddr);
        out1 = await erc20BalanceOf(addr1, decimals, web3s.tokenAddr)

      } else if (data.enum2 === "transfer") {

      } else if (data.enum2 === "approve") {

      }
    } else if (data.enum1 === tokenOnChains[2]) {
      //goldcoin_ethereum

      if (data.enum2 === "getBalance") {

      }
    } else if (data.enum1 === tokenOnChains[3]) {
      //nftDragon_ethereum
      if (!addr1) {
        out1 = { ...out1, err: "Invalid addr1" }
      }

    } else if (data.enum1 === tokenOnChains[4]) {
    } else if (data.enum1 === tokenOnChains[5]) {
    } else {
      out1 = { ...out1, err: "Invalid enum1" }
    }

    lg("out1:", out1)
    if (out1.err) {
      toast({ description: `Failed: ${out1.err}`, variant: 'destructive' })
    } else {
      toast({ description: `Success ${out1.str1}` })
      setOutputs(out1)
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
            <Button className='!bg-primary-500 mt-5' type="submit" isLoading={isLoading} >Submit to Blockchain</Button>
          </form>
        </Form>

      </CardContent>
    </Card>
  )
}

export default EthereumDiv;
