import bcryptjs from "bcryptjs";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Register POST endpoint");
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existingUser = await prisma.userTable.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.userTable.create({
      data: {
        email,
        password: hashedPassword,
        providerID: "1",
        isPaid: false,
        isActive: true,
        isDelete: false,
        userName: body.username,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ message: user }, { status: 200 });
  } catch (error) {
    console.log("Register Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
