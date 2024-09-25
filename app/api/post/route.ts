import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  return NextResponse.json({ message: "Hello, World!" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({
    message: `POST successfully. Thanks for posting ${JSON.stringify(body)}`,
  });
}
