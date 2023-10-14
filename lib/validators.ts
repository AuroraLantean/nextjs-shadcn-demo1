import { z } from "zod";

export const dbInputSchema = z.object({
  enum1: z.enum(["addOrUpdateOne", "findAll", "findOne", "deleteOne", "deleteAll"], {
    required_error: "You need to select one radio selection",
  }),
  id: z.string().optional(),
  title: z.string().optional(),
  total: z.string().optional(),
});

export const zustandSchema = z.object({
  enum1: z.enum(["add", "substract", "set", "reset", "addObjNum1", "addObjNum2"], {
    required_error: "You need to select one radio selection",
  }),
  floatNum1: z.string().min(1, {
    message: "input requires at least 1 character.",
  }).max(7, {
    message: "input exceeds the maximum length",
  }).refine((val) => !isNaN(val as unknown as number), {
    message: "input should be a number",
  }),
  floatNum2: z.string().max(7, {
    message: "input exceeds the maximum length",
  }).refine((val) => !isNaN(val as unknown as number), {
    message: "input should be a number",
  }),
});
export type InputContactForm = z.infer<typeof contactFormSchema>;
export const contactFormSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(2, { message: "name too short" })
    .max(255),
  socialMedia: z
    .string()
    .max(100, { message: "socialMedia username link too long" }),
  message: z
    .string()
    .min(7, { message: "message too short" })
    .max(255, { message: "message too long" }),
});

export const registerSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(3, { message: "username too short" })
    .max(255),
  userId: z
    .string()
    .min(7, { message: "userId too short" })
    .max(7)
    .refine((val) => !isNaN(val as unknown as number), {
      message: "ID should be a number",
    }),
  year: z.string().min(2, { message: "year too short" }).max(10),
  password: z.string().min(6, { message: "passsword too short" }).max(100),
  confirmPassword: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "passsword too short" }).max(100),
});

export const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(50),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
  language: z.string({
    required_error: "Please select a language.",
  }),
})

export const buyNftSchema = z.object({
  nftId: z.string().min(1, {
    message: "NFT ID requires at least 1 character.",
  }).max(7, {
    message: "NFT ID exceeds the maximum length",
  }).refine((val) => !isNaN(val as unknown as number), {
    message: "NFT ID should be a number",
  }),
  address: z
    .string({
      required_error: "Please enter an address",
    }),
  amount: z
    .string().min(1, {
      message: "amount requires at least 1 character.",
    }).max(20, {
      message: "amount exceeds the maximum length",
    }).refine((val) => !isNaN(val as unknown as number), {
      message: "Amount should be a number",
    }),
})

export const UserValidation = z.object({
  profile_photo: z.string().url({ message: "should be an URL" }).nonempty({ message: "cannot be empty" }),
  name: z.string().min(3, { message: "minimum 3 characters" }).max(30, { message: "maximum 30 characters" }),
  username: z.string().min(3, { message: "minimum 3 characters" }).max(30, { message: "maximum 30 characters" }),
  bio: z.string().min(3, { message: "minimum 3 characters" }).max(1000, { message: "maximum 1000 characters" })
});

export const ThreadValidation = z.object({
  thread: z.string().nonempty({ message: "cannot be empty" }).min(3, { message: "minimum 3 characters" }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z.string().nonempty({ message: "cannot be empty" }).min(3, { message: "minimum 3 characters" }),
});