import * as z from "zod";
import { UserRole } from "@prisma/client";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  username: z.optional(z.string()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
  btc: z.number().optional(),
  usdt: z.number().optional(),
  eth: z.number().optional(),
  status: z.enum(["pending", "successful"]).optional(),
  bankName: z.optional(z.string()),
  accountNumber: z.optional(z.string()),
  routingNumber: z.optional(z.string()),
  accountHolderName: z.optional(z.string()),
  iban: z.optional(z.string()),
  swiftCode: z.optional(z.string()),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  username: z.string().min(1, {
    message: "Username is required",
  }),
});

export const AccountSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  routingNumber: z.string().min(1, "Routing number is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  iban: z.string().optional(),
  swiftCode: z.string().optional(),
});

export const editUserSchema = z.object({
  userId: z.string(),
  role: z.enum(["USER", "ADMIN"]),
});