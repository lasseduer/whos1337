import {
  handleAuth,
  handleCallback,
  Session,
  Claims,
} from "@auth0/nextjs-auth0";
import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";

import { generateName } from "@/app/utils";

const upsertUser = async (user: Claims): Promise<string> => {
  try {
    const upsertedUser = await sql`
        INSERT INTO users (
          userid,
          nickname
        ) VALUES (
          ${user.sub},
          ${generateName()}
        ) 
        ON CONFLICT (userid)
        DO UPDATE SET updated = NOW()
        RETURNING nickname;
      `;

    return upsertedUser.rows[0].nickname;
  } catch (error) {
    throw new Error("Failed to upsert user");
  }
};

const afterCallback = async (_: NextRequest, session: Session) => {
  if (session.user) {
    const userNickname = await upsertUser(session.user);
    
    session.user.nickname = userNickname;
  }

  return session;
};

export const GET = handleAuth({
  async callback(req: any, res: any) {
    try {
      return await handleCallback(req, res, { afterCallback });
    } catch (error: any) {
      res.status(error.status || 500).end();
    }
  },
});
