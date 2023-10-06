"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { useItemsStore } from '@/store/store';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { zustandSchema } from '@/lib/validators';
import { cn } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type Props = {}

const ItemInputForm = (props: Props) => {
  const { toast } = useToast();
  const { totalNum, addNum, decreaseNum, updateNum, removeNum, obj, addObjNum1, addObjNum2, sumObj, objSum, items, setItems, addVotes, fetchAllItems } = useItemsStore(
    (state) => state
  );

  type Input = z.infer<typeof zustandSchema>;
  const form = useForm<Input>({
    resolver: zodResolver(zustandSchema),
    defaultValues: {
      enum1: "add",
      floatNum1: "",
      floatNum2: "",
    },
  });
  function onSubmit(data: Input) {
    //alert(JSON.stringify(data, null, 4));
    console.log(data);
    toast({
      title: "submitted values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    if (data.enum1 === "add") {
      addNum(Number(data.floatNum1))
    } else if (data.enum1 === "remove") {
      decreaseNum(Number(data.floatNum1));
    } else if (data.enum1 === "update") {
      updateNum(Number(data.floatNum1));
    } else if (data.enum1 === "delete") {
      removeNum();
    } else if (data.enum1 === "addObjNum1") {
      addObjNum1(Number(data.floatNum1));
    } else if (data.enum1 === "addObjNum2") {
      addObjNum2(Number(data.floatNum1));
    }
    sumObj()
  }
  return (
    <div>
      <Card className="w-[370px]">
        <CardHeader>
          <CardTitle>ItemInputForm: Zustand State Management</CardTitle>
          <p>TotalNum: {totalNum}</p>
          <p>TotalObjNum: {objSum}</p>
          <p>{JSON.stringify(obj, null, 2)}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-1"
            >

              {/* radio buttons */}
              <FormField
                control={form.control}
                name="enum1"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Radio buttons...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex flex-row space-y-1">
                          <FormItem className="radio-item">
                            <FormControl>
                              <RadioGroupItem value="add" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Add
                            </FormLabel>
                          </FormItem>
                          <FormItem className="radio-item">
                            <FormControl>
                              <RadioGroupItem value="remove" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Remove
                            </FormLabel>
                          </FormItem>
                          <FormItem className="radio-item">
                            <FormControl>
                              <RadioGroupItem value="update" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Update
                            </FormLabel>
                          </FormItem>
                          <FormItem className="radio-item">
                            <FormControl>
                              <RadioGroupItem value="delete" />
                            </FormControl>
                            <FormLabel className="font-normal">Delete</FormLabel>
                          </FormItem>
                        </div>

                        <div className="flex flex-row space-y-1">
                          <FormItem className="radio-item">
                            <FormControl>
                              <RadioGroupItem value="addObjNum1" />
                            </FormControl>
                            <FormLabel className="font-normal">AddObjNum1</FormLabel>
                          </FormItem>
                          <FormItem className="radio-item">
                            <FormControl>
                              <RadioGroupItem value="addObjNum2" />
                            </FormControl>
                            <FormLabel className="font-normal">AddObjNum2</FormLabel>
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
                    <FormLabel>Float Input1</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a float input..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* floatNum2 */}
              <FormField
                control={form.control}
                name="floatNum2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Float Input2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a float number..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  className='!bg-primary' type="submit"
                >
                  Run
                </Button>
              </div>
            </form>
          </Form>

        </CardContent>
      </Card>
    </div>
  )
}

export default ItemInputForm;