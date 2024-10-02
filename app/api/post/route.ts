import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { sql, db } from "@vercel/postgres";

import {
  generateName,
  getMillisecondsAfter1337,
  MILLISECONDS_IN_MINUTE,
} from "@/app/utils";

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

  const dbClient = await db.connect();

  try {
    if (!post) {
      throw new Error("Post is required");
    }

    await dbClient.query("BEGIN");

    await dbClient.query(`
      INSERT INTO eventsdev (
        message, 
        timestamp, 
        timezone, 
        userid
      ) VALUES (
        '${post.message}', 
        '${post.timestamp}', 
        '${post.timeZone}', 
        (
          SELECT id 
          FROM usersdev 
          WHERE userid = '${userid}'
        )
      );
    `);
    if (userid) {
      const points =
        MILLISECONDS_IN_MINUTE -
        (getMillisecondsAfter1337(post.timestamp) ?? MILLISECONDS_IN_MINUTE);

      await dbClient.query(`
      UPDATE usersdev
      SET points = points + ${points}
      WHERE userid = '${userid}';
    `);
    }
    await dbClient.query("COMMIT");
  } finally {
    dbClient.release();
  }

  return NextResponse.json({
    message: "POST successfully. Thank you for posting",
  });
}
