"use client"
import React from 'react'
import { Button } from '../ui/button';
import { addNum, addObjNum1, addObjNum2, setNum, subNum, sumObj, useObjStore } from '@/store/obj';
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
import { APP_WIDTH_MIN } from '@/constants/site_data';

type Props = {}

const ItemInputForm = (props: Props) => {
  const { toast } = useToast();
  const { totalNum, obj, objSum } = useObjStore(
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
    } else if (data.enum1 === "substract") {
      subNum(Number(data.floatNum2));
    } else if (data.enum1 === "set") {
      setNum(Number(data.floatNum1));
    } else if (data.enum1 === "reset") {
      setNum(0);
    } else if (data.enum1 === "addObjNum1") {
      addObjNum1(Number(data.floatNum1));
      sumObj()
    } else if (data.enum1 === "addObjNum2") {
      addObjNum2(Number(data.floatNum2));
      sumObj()
    }
  }
  return (
    <Card className={`w-[${APP_WIDTH_MIN}px] gap-2`}>
      <CardHeader>
        <CardTitle>ItemInputForm: Zustand Client State Management</CardTitle>
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
                            <RadioGroupItem value="substract" />
                          </FormControl>
                          <FormLabel>
                            Substract
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="set" />
                          </FormControl>
                          <FormLabel>
                            Set
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="reset" />
                          </FormControl>
                          <FormLabel>
                            Reset
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

            <Button className='primary-color' type="submit">Run</Button>
          </form>
        </Form>

      </CardContent>
    </Card>
  )
}

//  <div className="flex flex-row space-y-1">
export default ItemInputForm;