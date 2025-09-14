export const runtime = "nodejs";

import { Anthropic } from "@anthropic-ai/sdk";
import {
  Message
} from "@anthropic-ai/sdk/resources/messages";
import { defaultPrompt, promptMap } from "../../defaults/basePrompts";
import { getSystemPrompt } from "../../defaults/prompts";
const anthropic = new Anthropic();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userRequest = body.prompt;
    console.log("This is the user's Request :-", userRequest);
    if (!userRequest || typeof userRequest !== "string") {
      return new Response("No prompt provided", { status: 400 });
    }
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          console.log("Reaching here");
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

          console.log("Tech by user :-", techByUser);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "tech", data: techByUser })}\n\n`
            )
          );

          const basePrompt = promptMap[techByUser] || defaultPrompt;
          const userMessage = `${basePrompt}\n\nUser Request: ${userRequest}`;

          console.log("User Message :-", userMessage);

          const codeStream = anthropic.messages.stream({
            messages: [{ role: "user", content: userMessage }],
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4096,
            system: getSystemPrompt(),
          });

          codeStream.on("text", (text: string) => {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "code", data: text })}\n\n`
              )
            );
          });

          console.log(codeStream, "Reaching here");

          codeStream.on("end", () => {
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
