import { NextRequest, NextResponse } from "next/server";
import {
  getClosestPostTo1337,
  getDbClient,
  getUserById,
  updateUser,
} from "../utils";
import { UserDto } from "@/app/models/dtos/user-dto.model";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { DbUserWrite } from "../models";

export const GET = withApiAuthRequired(async (_: NextRequest) => {
  const session = await getSession();

  const dbClient = getDbClient();
  let result: UserDto | undefined = undefined;

  await dbClient.connect();
  try {
    const user = await getUserById(dbClient, session?.user.sub);

    if (!user) {
      return NextResponse.json({
        status: 404,
        error: "User not found",
      });
    }
    const personalBest = await getClosestPostTo1337(dbClient, user.id, 1);

    result = {
      nickname: user.nickname,
      points: user.points,
      personalBest: personalBest ? personalBest[0]?.timestamp : "",
    };
  } finally {
    dbClient.end();
  }

  return NextResponse.json(result);
});

export const PUT = withApiAuthRequired(async (res: NextRequest) => {
  let result: UserDto | undefined = undefined;
  const session = await getSession();

  if (!session?.user?.sub) {
    return NextResponse.json({
      status: 401,
      error: "Unauthorized",
    });
  }

  const newUser = await res.json();
  const dbClient = getDbClient();

  await dbClient.connect();
  try {
    const dbUser: DbUserWrite = {
      userid: session.user.sub,
      nickname: newUser.nickname,
    };
    const updatedUser = await updateUser(dbClient, dbUser);

    if (!updatedUser) {
      return NextResponse.json({
        status: 404,
        error: "User not found",
      });
    }

    const personalBest = await getClosestPostTo1337(
      dbClient,
      updatedUser?.id,
      1
    );

    result = {
      nickname: updatedUser.nickname,
      points: updatedUser.points,
      personalBest: personalBest ? personalBest[0]?.timestamp : "",
    };
  } finally {
    dbClient.end();
  }

  return NextResponse.json(result);
});
