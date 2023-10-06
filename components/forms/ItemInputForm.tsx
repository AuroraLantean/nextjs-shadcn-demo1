"use client"
import React from 'react'
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
  const { totalNum, increaseNum, decreaseNum, updateNum, removeAllNum, items, setItems, increaseVotes, fetchAllItems } = useItemsStore(
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
      increaseNum(Number(data.floatNum1))
    } else if (data.enum1 === "update") {
      updateNum(Number(data.floatNum1));
    } else if (data.enum1 === "delete") {
      removeAllNum();
    }
  }
  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>ItemInputForm: Zustand State Management</CardTitle>
          <CardDescription>TotalNum: {totalNum}</CardDescription>
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
                        className="flex flex-row space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="add" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Add
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="update" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Update
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="delete" />
                          </FormControl>
                          <FormLabel className="font-normal">Delete</FormLabel>
                        </FormItem>
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