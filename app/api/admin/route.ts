import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";


import { db } from "@/lib/db";

export async function GET(req: Request) {
  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const skip = (page - 1) * limit;

  try {
    const users = await db.user.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
       
      },
    });

    const total = await db.user.count();

    return NextResponse.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}