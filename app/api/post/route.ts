import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

import { PostDto } from "./../../models/dtos";

export async function GET(_: NextRequest) {
  const posts: PostDto[] = [
    { id: 1, name: "John Doe", message: "Hello, World!", timestamp: "2024-09-25T13:37:05.542" },
    { id: 2, name: "Jane Doe", message: "Hi, there!", timestamp: "2024-09-25T13:37:02.883" },
    { id: 3, name: "John Smith", message: "Hey, You!", timestamp: "2024-09-25T13:37:32.129" },
  ];
  
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const postTime = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
  const post: PostDto = await req.json();

  return NextResponse.json({
    message: `POST successfully. Thank you ${post.name} for posting '${post.message}' at ${postTime}`,
  });
}
