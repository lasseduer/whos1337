import { NextRequest, NextResponse } from "next/server";
import { getDbClient, getShamePosts } from "../utils";
import { PostLeaderboardDto } from "@/app/models/dtos";

export async function GET(_: NextRequest) {
  const dbClient = getDbClient();
  const result: PostLeaderboardDto[] = [];

  await dbClient.connect();
  try {
    const leaderboardPosts = await getShamePosts(dbClient, undefined, 10);

    if (leaderboardPosts) {
      result.push(
        ...leaderboardPosts.map((post) => ({
          nickname: post.nickname,
          message: post.message,
          timestamp: post.timestamp,
          timeDifference: post.timeDifference,
        }))
      );
    }
  } finally {
    dbClient.end();
  }

  return NextResponse.json(result);
}

export async function POST(_: NextRequest) {}
