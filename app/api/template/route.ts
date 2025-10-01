import { Anthropic } from "@anthropic-ai/sdk";

import {
  Message
} from "@anthropic-ai/sdk/resources/messages";
import { defaultPrompt, promptMap } from "../../defaults/basePrompts";
import { getSystemPrompt } from "../../defaults/prompts"; 
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadResponseToR2 } from "@/lib/r2";

const anthropic = new Anthropic();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userID = session?.user?.id;
    const body = await req.json(); 
    const userRequest = body.prompt; 
    if (!userRequest || typeof userRequest !== "string") {
      return new Response("No prompt provided", { status: 400 });
    }
     let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          const response = await anthropic.messages.create({
            messages: [{ role: "user", content: userRequest }],
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            system:
              "Return the tech based on what do you think this project should be. Only return a single word for example if you think it's a node project then return 'node', if it's a react project return 'react' Same with other tech return the tech in single word. Do not return anything extra",
          });

          const firstContent = response.content[0];
          if (firstContent.type !== "text") {
            throw new Error("Expected text response");
          }
          const techByUser = firstContent.text; 

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "tech", data: techByUser })}\n\n`
            )
          );

          const basePrompt = promptMap[techByUser] || defaultPrompt;
          const userMessage = `${basePrompt}\n\nUser Request: ${userRequest}`;
          const codeStream = anthropic.messages.stream({
            messages: [{ role: "user", content: userMessage }],
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4096,
            system: getSystemPrompt(),
          });

          codeStream.on("text", (text: string) => {
            fullResponse += text;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "code", data: text })}\n\n`
              )
            );
          });

          codeStream.on("end", async() => {
             try {
              const r2Key = await uploadResponseToR2(userID || "anonymous", "response.json", fullResponse);

              await prisma.userPromptHistoryTable.create({
                data: {
                  userID: userID || "",
                  prompt: userRequest,
                  r2Key,
                },
              });
            } catch (err) {
              console.error("❌ Failed to save to R2/DB:", err);
            }
            controller.enqueue(encoder.encode(`event: end\n`));
            controller.enqueue(encoder.encode(`data: completed\n\n`));
            controller.close();
          });

          codeStream.on("error", (error: Error) => {
            console.error("Streaming error:", error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "error",
                  data: error.message,
                })}\n\n`
              )
            );
            controller.close();
          });

          codeStream.on("message", (message: Message): void => {
            console.log("Message", message);
          });
        } catch (error) {
          console.log("Error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                data: "Failed to generate code",
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
