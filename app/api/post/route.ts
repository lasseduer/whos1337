import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "./../utils";

import {
  generateName,
  getMillisecondsAfter1337,
  MILLISECONDS_IN_MINUTE,
} from "@/app/utils";

import { NewPostDto, PostDto } from "./../../models/dtos";

export async function GET(_: NextRequest) {
  const result: PostDto[] = [];
  const dbClient = getDbClient();
  
  await dbClient.connect();
  try {
    const { rows } = await dbClient.query(`
      SELECT 
        users.nickname,
        events.message,
        TO_CHAR(events.timestamp AT TIME ZONE timezone, 'YYYY-MM-DD HH24:MI:SS.MS') AS timestamp,
        events.timezone
      FROM events
      LEFT JOIN users ON users.id = events.userid;
    `);
    
    result.push(...rows.map(
      (row, index) =>
        ({
          id: index,
          message: row.message,
          name: `${row.nickname ?? "Anonymous User - " + generateName()}`,
          timestamp: row.timestamp,
          timeZone: row.timezone,
        }) as PostDto
    ));
  } finally {
    dbClient.end();
  }

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const post: NewPostDto = await req.json();
  const session = await getSession();
  const userid = session?.user?.sub ?? "";
  const dbClient = getDbClient();

  await dbClient.connect();
  try {
    if (!post) {
      throw new Error("Post is required");
    }

    await dbClient.query("BEGIN");

    await dbClient.query(`
      INSERT INTO events (
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
          FROM users 
          WHERE userid = '${userid}'
        )
      );
    `);
    if (userid) {
      const points =
        MILLISECONDS_IN_MINUTE -
        (getMillisecondsAfter1337(post.timestamp) ?? MILLISECONDS_IN_MINUTE);

      await dbClient.query(`
      UPDATE users
      SET points = points + ${points}
      WHERE userid = '${userid}';
    `);
    }
    await dbClient.query("COMMIT");
  } finally {
    dbClient.end();
  }

  return NextResponse.json({
    message: "POST successfully. Thank you for posting",
  });
}
