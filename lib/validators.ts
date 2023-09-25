import { z } from "zod";

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
      message: "Student ID should be a number",
    }),
  year: z.string().min(2, { message: "year too short" }).max(10),
  password: z.string().min(6, { message: "passsword too short" }).max(100),
  confirmPassword: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "passsword too short" }).max(100),
});
//{required_error: "select xyz"}

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