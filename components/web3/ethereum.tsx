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
import { ethersInit, getChainObj } from '@/lib/ethers';
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Separator } from '../ui/separator';

type Props = {}

const EthereumDiv = (props: Props) => {
  const lg = console.log;
  lg('EthereumDiv. goldcoin addr:', goldcoin.address, ', dragonNft addr:', dragonNft.address);
  const inputDefault = {
    chainName: '',
    chainId: '',
    ctrtAddr: '',
    account: '',
    addr1: '',
    addr2: '',
    amount1: '',
    amount2: '',
    balcETH: '',
  };
  const effectRan = useRef(false)
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [inputs, setInputs] = useState<typeof inputDefault>(inputDefault);

  useEffect(() => {
    console.log("useEffect ran")
    if (effectRan.current === true) {
      setIsClient(true);
      const initRun = async () => {
        const out = { chainId: "0xaa36a7", account: "0xbb0914d6c344ac84b26d165d85fcafdb66f45434", err: "", warn: "" };
        //const out = await ethersInit();
        if (out.err) {
          toast({ description: `Failed: ${JSON.stringify(out.err)}`, variant: 'destructive' })
          return true;
        }
        if (out.warn) {
          toast({ description: `Failed: ${JSON.stringify(out.warn)}`, variant: 'destructive' })
          return true;
        }
        toast({ description: "web3 initialized successfully!" });
        lg("out:", out)
        const { chainHex, chainStr } = getChainObj(out.chainId!)
        setInputs({
          ...inputDefault,
          chainName: capitalizeFirst(chainStr),
          chainId: out.chainId!,
          account: out.account!,
        })
      }
      initRun()
    }
    return () => {
      lg("unmounted useeffect()...")
      effectRan.current = true
    }
  }, []);

  const pause = async (input: string) => {
    const tx = await fetch('https');// contract.pause();
    return { error: "" }//tx.wait();
  };
  const queryClient = useQueryClient();
  const { mutate: sendEth, isLoading } = useMutation({
    mutationFn: async (input: string) => pause(input),
    onSuccess: async (): Promise<void> => {
      toast({ description: "Success" });
    },
    onError: (err: any) => {
      console.log("err:", err)
      toast({ description: `Failed: ${err}`, variant: 'destructive' })
    },
  })

  type InputT = z.infer<typeof web3InputSchema>;
  const form = useForm<InputT>({
    resolver: zodResolver(web3InputSchema),
    defaultValues: {
      enum1: "goldCoin",
      enum2: "transfer",
      floatNum1: "",
      addr1: "",
      addr2: "",
    },
  });
  async function onSubmit(data: InputT) {
    console.log("onSubmit", data);
    //alert(JSON.stringify(data, null, 4));
    let out = null;
    const floatNum1 = parseFloatSafe(data.floatNum1);

    if (data.enum1 === "goldCoin") {
      //out = await findAll();
    } else if (data.enum1 === "erc721Dragon") {

    } else {
      console.error("invalid enum1")
    }
    lg("out:", out)
    toast({
      title: "result:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(out, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Card className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <CardHeader>
        <CardTitle>Ethereum Related Chains {isClient ? Math.trunc(Math.random() * 10000) : 0}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">Detected Chain: {inputs.chainName}</p>
        <p className="break-words text-xl font-semibold">Account: {makeAddr(inputs.account)}</p>
        <p className='text-xl font-semibold mb-3'>ETH Balance: {inputs.balcETH}</p>

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
            <Button className='destructive-color mt-5' type="submit">Submit To Blockchain</Button>
          </form>
        </Form>

      </CardContent>
    </Card>
  )
}

export default EthereumDiv;
