"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: any) => {

  // Validate input
  const validated = RegisterSchema.safeParse(values) 
  if(!validated.success) {
    return {
      error: "Invalid input"
    }
  }

  const {email, password, name, username} = validated.data

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Check for duplicate user
  const existingUser = await getUserByEmail(email)
  if(existingUser) {
    return {
      error: "Email already exists" 
    }
  }

  // Create new user
  const user = await db.user.create({
    data: {
      email,
      name,
      username,
      password: hashedPassword,
      btc: 0.0,
      usdt: 0.0,
      eth: 0.0,
     
    }
  })


  // Generate and send verification email
  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(email, verificationToken.token)

  // Return user and balance  
  return {
    message: "Registration successful check email to verify account",  
  }

}