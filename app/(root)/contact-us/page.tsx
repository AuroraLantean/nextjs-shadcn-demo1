"use client"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { InputContactForm, contactFormSchema } from "@/lib/validators";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/lib/sendEmail";

export default function ContactForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  //type Input = z.infer<typeof contactFormSchema>;
  const form = useForm<InputContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      socialMedia: "",
      email: "",
      name: "",
      message: "",
    },
  });
  //console.log(form.watch())

  async function onSubmit(data: InputContactForm) {
    //alert(JSON.stringify(data, null, 4));
    setIsLoading(true)
    console.log("onSubmit:", data);
    const result = await sendEmail(data);
    console.log("🚀 sendEmail result:", result)
    if (result?.error) {
      toast({
        title: "Email failed",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email Sending Success!",
      });
      //reset()
    }
    setIsLoading(false)
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>ContactForm</CardTitle>
          <CardDescription>Start the journey with me today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative space-y-3 overflow-x-hidden"
            >

              {/* name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* socialMedia */}
              <FormField
                control={form.control}
                name="socialMedia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Media User Link(Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Social Media user link..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Telegram, Twitter(X), etc... for quicker response
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        className="account-form_input no-focus"
                        {...field}
                        placeholder="Enter your message..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className={''}
                  disabled={isLoading}
                >
                  Submit
                </Button>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
