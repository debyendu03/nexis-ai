import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

//Initialize the Google Generative AI instance
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

//select model 
const MODEL = "gemini-3.1-flash-lite"

//Nexis Core System Instructions (Persona & Constraints)
const SYSTEM_INSTRUCTION = `
You are Nexis, an intelligent, minimal, and highly capable AI companion.
Guidelines:
- Provide direct, concise, and structured answers.
- Format responses cleanly using Markdown (use bolding, bullet points, headers).
- Use syntax-highlighted code blocks with the correct language tag for all code.
- Maintain an authentic, helpful, and sophisticated tone.
`;

export async function   POST(req: NextRequest) {
  try {
    // Check if API key is provided
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 },
      );
    }

    // Extract the messages array from the incoming request body
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages array provided." },
        { status: 400 },
      );
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    //Format chat history for Gemini SDK structure
    const history = messages
      .slice(0, -1)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    // The most recent prompt from the user
    const currentMessage = messages[messages.length - 1].content;

    //Start multi-turn chat session with history
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    // Request streaming response from Gemini
    const result = await chat.sendMessageStream(currentMessage);

    // Create a ReadableStream to stream chunks back to the browser
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
          controller.close();
        } catch (streamError) {
          controller.error(streamError);
        }
      },
    });

    // Return the stream with standard streaming headers
    return new Response(customStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process chat request" },
      { status: 500 },
    );
  }
}
