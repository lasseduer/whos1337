import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

import { PostDto } from "./../../models/dtos";

export async function GET(_: NextRequest) {
  return NextResponse.json({ message: "Hello, World!" });
}

export async function POST(req: NextRequest) {
  const postTime = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
  const post: PostDto = await req.json();

  return NextResponse.json({
    message: `POST successfully. Thank you ${post.name} for posting '${post.message}' at ${postTime}`,
  });
}
