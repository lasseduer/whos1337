import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

import { generateName } from "@/app/utils";

import { NewPostDto, PostDto } from "./../../models/dtos";

export async function GET(_: NextRequest) {
  const { rows } = await sql`
      SELECT 
        usersdev.nickname,
        eventsdev.message,
        TO_CHAR(eventsdev.timestamp AT TIME ZONE timezone, 'YYYY-MM-DD HH24:MI:SS.MS') AS timestamp,
        eventsdev.timezone
      FROM eventsdev
      LEFT JOIN usersdev ON usersdev.id = eventsdev.userid;`;
  const postDto = rows.map(
    (row, index) =>
      ({
        id: index,
        message: row.message,
        name: `${row.nickname ?? "Anonymous User - " + generateName()}`,
        timestamp: row.timestamp,
        timeZone: row.timezone,
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
    await sql`
      INSERT INTO eventsdev (
        message, 
        timestamp, 
        timezone, 
        userid
      ) VALUES (
        ${post.message}, 
        ${post.timestamp}, 
        ${post.timeZone}, 
        (
          SELECT id 
          FROM usersdev 
          WHERE userid = ${userid}
        )
      );`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({
    message: "POST successfully. Thank you for posting",
  });
}
