"use client"
import React from 'react'
import { Button } from '../ui/button';
import { useItemsStore } from '@/store/store';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Label } from "@/components/ui/label"
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
  console.log("ItemInputForm...")
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
      sumObj()
    } else if (data.enum1 === "addObjNum2") {
      addObjNum2(Number(data.floatNum2));
      sumObj()
    }
  }
  return (
    <Card className="w-[370px]">
      <CardHeader>
        <CardTitle>ItemInputForm: Zustand State Management</CardTitle>
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
                            <RadioGroupItem value="add" />
                          </FormControl>
                          <FormLabel>
                            Add
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="update" />
                          </FormControl>
                          <FormLabel>
                            Update
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="remove" />
                          </FormControl>
                          <FormLabel>
                            Remove
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="delete" />
                          </FormControl>
                          <FormLabel>
                            Delete
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="addObjNum1" />
                          </FormControl>
                          <FormLabel>
                            AddObjNum1
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="addObjNum2" />
                          </FormControl>
                          <FormLabel>
                            AddObjNum2
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
                  <h3>Float Input1</h3>
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
                  <h3>Float Input2</h3>
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

            <Button className='blue-button' type="submit">Run</Button>
          </form>
        </Form>



      </CardContent>
    </Card>

  )
}

//  <div className="flex flex-row space-y-1">
export default ItemInputForm;