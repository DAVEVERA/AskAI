import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!question || typeof question !== "string" || !question.trim()) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: question.trim() }],
  });

  const answer =
    message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ answer });
}
