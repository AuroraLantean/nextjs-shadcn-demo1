import * as z from 'zod';

export const UserValidation = z.object({
  profile_photo: z.string().url({ message: "should be an URL" }).nonempty({ message: "cannot be empty" }),
  name: z.string().min(3, { message: "minimum 3 characters" }).max(30, { message: "maximum 30 characters" }),
  username: z.string().min(3, { message: "minimum 3 characters" }).max(30, { message: "maximum 30 characters" }),
  bio: z.string().min(3, { message: "minimum 3 characters" }).max(1000, { message: "maximum 1000 characters" })
})