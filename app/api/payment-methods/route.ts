import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { PaymentMethodType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, type, instructions, walletAddress, accountInfo } = await req.json();

    const paymentMethod = await db.paymentMethod.create({
      data: {
        name,
        type: type as PaymentMethodType,
        instructions,
        walletAddress,
        accountInfo,
      },
    });

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error("[PAYMENT_METHODS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const paymentMethods = await db.paymentMethod.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error("[PAYMENT_METHODS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
