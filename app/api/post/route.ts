import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { sql } from "@vercel/postgres";
import ShortUniqueId from "short-unique-id";

import { NewPostDto, PostDto } from "./../../models/dtos";

export async function GET(_: NextRequest) {
  const posts = await sql`SELECT * FROM Posts;`;
  const postDto = posts.rows.map(
    (post, index) =>
      ({
        id: index,
        message: post.message,
        name: post.name,
        timestamp: post.timestamp,
      }) as PostDto
  );

  return NextResponse.json(postDto);
}

export async function POST(req: NextRequest) {
  const postTime = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
  const post: NewPostDto = await req.json();
  const newId = new ShortUniqueId({ length: 12 }).randomUUID();

  try {
    if (!post) throw new Error("Post is required");
    await sql`INSERT INTO Posts (Id, Name, Message, Timestamp) VALUES (${newId}, ${post.name}, ${post.message}, ${post.timestamp});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({
    message: `POST successfully. Thank you ${post.name} for posting '${post.message}' at ${postTime}`,
  });
}
