import { generateName } from "@/app/utils";
import { getSession } from "@auth0/nextjs-auth0";
import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";

/**
 * Authenticating your Liveblocks application
 * https://liveblocks.io/docs/authentication
 */

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  const userSession = await getSession();
  const user = userSession?.user;

  const userInfo = {
    name: user?.nickname ?? generateName(),
    email: user?.email,
    avatar: user?.picture ?? "https://i.pravatar.cc/300",
  }

  // Create a session for the current user (access token auth)
  const session = liveblocks.prepareSession(`user-${userInfo.name}`, {
    userInfo: userInfo,
  });

  // Use a naming pattern to allow access to rooms with a wildcard
  session.allow(`whos1337`, session.READ_ACCESS);

  const { status, body } = await session.authorize();
  return new NextResponse(body, { status });
}
