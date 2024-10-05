import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "./../utils";
import { isValid, parse } from "date-fns";
import {
  generateName,
  getMillisecondsAfter1337,
  MILLISECONDS_IN_MINUTE,
} from "@/app/utils";
import { CreatePostResponseDto, NewPostDto, PostDto } from "@/app/models/dtos";

export async function GET(req: NextRequest) {
  const result: PostDto[] = [];
  const dbClient = getDbClient();

  const { searchParams } = new URL(req.url);
  let date = searchParams.get("date");

  if (!date || !isValid(parse(date, "yyyy-MM-dd", new Date()))) {
    date = "";
  }

  await dbClient.connect();
  try {
    const { rows } = await dbClient.query(`
      SELECT
        events.id,
        users.nickname,
        events.message,
        TO_CHAR(events.timestamp AT TIME ZONE timezone, 'HH24:MI:SS.MS') AS timestamp,
        events.timezone
      FROM events
      LEFT JOIN users ON users.id = events.userid
      WHERE '${date}' = '' OR TO_CHAR(events.timestamp, 'YYYY-MM-DD') = '${date}'
      ORDER BY events.timestamp DESC;
    `);

    result.push(
      ...rows.map(
        (row: any) =>
          ({
            id: row.id,
            message: row.message,
            name: `${row.nickname ?? "Anonymous User - " + generateName()}`,
            timestamp: row.timestamp,
            timeZone: row.timezone,
          }) as PostDto
      )
    );
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
  const result: CreatePostResponseDto = {
    points: null,
    pointsInTotal: null,
  };

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
    const points =
      MILLISECONDS_IN_MINUTE -
      (getMillisecondsAfter1337(post.timestamp) ?? MILLISECONDS_IN_MINUTE);

    result.points = `${points}`;

    if (userid) {
      const { rows } = await dbClient.query(`
        UPDATE users
        SET points = points + ${points}
        WHERE userid = '${userid}'
        RETURNING points;
        `);

      result.pointsInTotal = `${rows[0].points}`;
    }

    await dbClient.query("COMMIT");
  } finally {
    dbClient.end();
  }

  return NextResponse.json(result);
}
