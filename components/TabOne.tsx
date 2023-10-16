import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "./ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { settingTabP1Schema, settingTabP2Schema } from "@/lib/validators"
import { IfInvalid } from "luxon/src/_util"

export function TabsOne() {
  const { toast } = useToast()

  type InputP1T = z.infer<typeof settingTabP1Schema>;
  const formP1 = useForm<InputP1T>({
    resolver: zodResolver(settingTabP1Schema),
    defaultValues: {
      name: "",
      username: "",
    },
  })
  type InputP2T = z.infer<typeof settingTabP2Schema>;
  const formP2 = useForm<InputP2T>({
    resolver: zodResolver(settingTabP2Schema),
    defaultValues: {
      passwordCurr: "",
      passwordNew: "",
    },
  })
  function onSubmit(values: InputP1T | InputP2T) {
    console.log("🚀 onSubmit ~ values:", values)
    if ("passwordCurr" in values && values.passwordCurr === values.passwordNew) {
      toast({
        title: "New password is the same as the current password",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Transaction submitted",
      description: "your message" + JSON.stringify(values),
    })
  }

  return (
    <Tabs defaultValue="account" className="w-[350px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...formP1}>
              <form onSubmit={formP1.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={formP1.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formP1.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="!primary-color">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...formP2}>
              <form onSubmit={formP2.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={formP2.control}
                  name="passwordCurr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formP2.control}
                  name="passwordNew"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="!primary-color">Submit</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>

          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

