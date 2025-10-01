import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getObjectStringFromR2 } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
 
  const history = await prisma.userPromptHistoryTable.findMany({
    where: { userID: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      prompt: true,
      r2Key: true,
      createdAt: true,
    },
  });

  const withResponses = await Promise.all(
    history.map(async (item) => {
      let fullResponse: string | null = null;

      if (item.r2Key) {
        try {
          fullResponse = await getObjectStringFromR2(item.r2Key);
        } catch (err) {
          console.error(`❌ Failed to fetch R2 object for key: ${item.r2Key}`, err);
        }
      }

      return {
        ...item,
        response: fullResponse,
      };
    })
  );

  return NextResponse.json(withResponses);
}
