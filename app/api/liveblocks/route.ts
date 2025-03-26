import { generateName } from "@/app/utils";
import { getSession } from "@auth0/nextjs-auth0";
import { Liveblocks } from "@liveblocks/node";
import { NextResponse } from "next/server";
import { getRoom } from "../utils/room";

/**
 * Authenticating your Liveblocks application
 * https://liveblocks.io/docs/authentication
 */

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST() {
  const userSession = await getSession();
  const user = userSession?.user;
  const userName = user?.nickname ?? generateName();

  const userInfo = {
    name: userName,
    email: user?.email,
    avatar: user?.picture ?? `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${userName}`,
  }

  // Create a session for the current user (access token auth)
  const session = liveblocks.prepareSession(`user-${userInfo.name}`, {
    userInfo: userInfo,
  });

  // Use a naming pattern to allow access to rooms with a wildcard
  session.allow(getRoom(`whos1337`), session.READ_ACCESS);

  const { status, body } = await session.authorize();

  return new NextResponse(body, { status });
}
