"use server";

import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const editUserSchema = z.object({
  userId: z.string(),
  role: z.nativeEnum(UserRole),
  status: z.string(),
});

export const updateUser = async (userId: string, values: {
  name?: string;
  email?: string;
  role?: UserRole;
  isTwoFactorEnabled?: boolean;
  status?: string;
}): Promise<{ error?: string; success?: string; user?: any }> => {
  try {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) {
      return { error: "Unauthorized! Only admins can perform this action." }
    }

    if (!userId) {
      return { error: "User ID is required" };
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: values.name,
        email: values.email,
        role: values.role,
      }
    });

    revalidatePath("/admin");

    return { 
      success: "User updated successfully!", 
      user: updatedUser
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Failed to update user. Please try again." }
  }
};

export const editUser = async (data: z.infer<typeof editUserSchema>) => {
  try {
    const validatedFields = editUserSchema.safeParse(data);
    
    if (!validatedFields.success) {
      throw new Error("Invalid fields");
    }

    const response = await fetch(`/api/users/${data.userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: data.role,
        status: data.status,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return { success: "User updated!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};