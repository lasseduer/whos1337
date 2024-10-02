import {
  handleAuth,
  handleCallback,
  Session,
  Claims,
} from "@auth0/nextjs-auth0";
import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";

import { generateName } from "@/app/utils";

const upsertUser = async (user: Claims): Promise<void> => {
  if (user) {
    try {
      await sql`
        INSERT INTO usersdev (
          userid,
          nickname
        ) VALUES (
          ${user.sub},
          ${generateName()}
        ) 
        ON CONFLICT (userid)
        DO UPDATE SET updated = NOW()
      `;
    } catch (error) {
      console.error("Error saving user:", error);
      // Log the error but don't throw to prevent login failure
    }
  }
};

const afterCallback = async (_: NextRequest, session: Session) => {
  await upsertUser(session.user);
  
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
