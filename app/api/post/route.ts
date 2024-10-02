import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

import { NewPostDto, PostDto } from "./../../models/dtos";

export async function GET(_: NextRequest) {
  const posts =
    await sql`SELECT name, message, TO_CHAR(timestamp AT TIME ZONE timezone, 'YYYY-MM-DD HH24:MI:SS.MS') AS timestamp, timezone FROM eventsdev;`;
  const postDto = posts.rows.map(
    (post, index) =>
      ({
        id: index,
        message: post.message,
        name: post.name,
        timestamp: post.timestamp,
        timeZone: post.timezone,
      }) as PostDto
  );

  return NextResponse.json(postDto);
}

export async function POST(req: NextRequest) {
  const post: NewPostDto = await req.json();
  const session = await getSession();
  const userid = session?.user?.sub ?? "";

  try {
    if (!post) throw new Error("Post is required");
    await sql`INSERT INTO eventsdev (message, timestamp, timezone, userid) VALUES (${post.message}, ${post.timestamp}, ${post.timeZone}, (SELECT id FROM usersdev WHERE userid = ${userid}));`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({
    message: `POST successfully. Thank you ${post.name} for posting '${post.message}'`,
  });
}
