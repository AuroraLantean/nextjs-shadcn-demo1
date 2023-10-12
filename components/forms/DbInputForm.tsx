"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dbInputSchema } from '@/lib/validators';
import { cn, parseFloatSafe } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { APP_WIDTH_MIN } from '@/constants/site_data';
import { addOne, addOrUpdateOne, deleteAll, deleteOne, findOne, findAll } from '@/lib/actions/box.actions';
import BoxCard from '../cards/BoxCard';

type Props = {}

const DbInputForm = (props: Props) => {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log("DbInputForm...")
  type Input = z.infer<typeof dbInputSchema>;
  const form = useForm<Input>({
    resolver: zodResolver(dbInputSchema),
    defaultValues: {
      enum1: "findAll",
      id: "",
      title: "",
      total: "",
      //floatNum2: "",
    },
  });
  async function onSubmit(data: Input) {
    //alert(JSON.stringify(data, null, 4));
    console.log(data);
    /*toast({
      title: "submitted values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });*/
    let out = null;
    const total = parseFloatSafe(data.total);

    if (data.enum1 === "findAll") {
      out = await findAll();

    } else if (data.enum1 === "findOne") {
      if (data.id) {
        out = await findOne(data.id)
        if (out === null) out = "not found"
      } else {
        console.log("data.id does not exist")
        out = "data.id does not exist";
      }
    } else if (data.enum1 === "addOrUpdateOne") {
      //if (data.id) {
      const input = { id: data.id, title: data.title, total };
      //out = await findOne(data.id)
      //outUpdated = { ...out, title: data.title, total: data.total}
      //await outUpdated.save();
      out = await addOrUpdateOne(input)
      // } else {
      //   const input = { title: data.title, total };
      //   out = await addOne(input)
      // }
    } else if (data.enum1 === "deleteOne") {
      if (data.id) {
        out = await deleteOne(data.id)
      } else {
        out = "data.id does not exist";
      }
    } else if (data.enum1 === "deleteAll") {
      out = await deleteAll()
    }
    console.log("out:", out)
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
        <CardTitle>DbInputForm - MongoDB APIs</CardTitle>
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
                            <RadioGroupItem value="addOrUpdateOne" />
                          </FormControl>
                          <FormLabel>
                            AddOrUpdateOne
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="findAll" />
                          </FormControl>
                          <FormLabel>
                            FindAll
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="findOne" />
                          </FormControl>
                          <FormLabel>
                            FindOne
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="deleteOne" />
                          </FormControl>
                          <FormLabel>
                            DeleteOne
                          </FormLabel>
                        </FormItem>

                        <FormItem className="radio-item">
                          <FormControl>
                            <RadioGroupItem value="deleteAll" />
                          </FormControl>
                          <FormLabel>
                            DeleteAll
                          </FormLabel>
                        </FormItem>

                      </div>

                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* id */}
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <h3>Id</h3>
                  <FormControl>
                    <Input placeholder="Enter id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <h3>Title</h3>
                  <FormControl>
                    <Input
                      placeholder="Enter title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* total */}
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <h3>Total</h3>
                  <FormControl>
                    <Input
                      placeholder="Enter total..."
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
export default DbInputForm;