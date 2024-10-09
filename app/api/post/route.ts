import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { createPost, getDbClient, getLatestPostByUserId } from "./../utils";
import { isValid, parse, differenceInMilliseconds } from "date-fns";
import { generateName } from "@/app/utils";
import { CreatePostResponseDto, NewPostDto, PostDto } from "@/app/models/dtos";
import { DbPostWrite } from "../models";

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
  const userId = session?.user?.sub ?? "";
  const result: CreatePostResponseDto = {
    points: null,
    pointsInTotal: null,
  };

  if (!post) {
    throw new Error("Post is required");
  }
  const dbClient = getDbClient();

  await dbClient.connect();
  try {
    let allowPost = true;

    if (userId) {
      const latestPost = await getLatestPostByUserId(dbClient, userId);

      if (latestPost) {
        const postTime = new Date(post.timestamp);
        const lastPostTime = new Date(latestPost.timestamp);

        allowPost = differenceInMilliseconds(postTime, lastPostTime) > 1337000;
      }
    }

    if (!allowPost) {
      return NextResponse.json(
        "You are only allowed to post once every 5 minutes to avoid spamming for points",
        { status: 429 }
      );
    }

    const newPost: DbPostWrite = {
      userId: userId,
      message: post.message,
      timestamp: post.timestamp,
      timezone: post.timeZone,
    };
    const { points, pointsInTotal } = await createPost(dbClient, newPost);

    result.points = points;
    result.pointsInTotal = pointsInTotal;
  } finally {
    dbClient.end();
  }

  return NextResponse.json(result);
}
