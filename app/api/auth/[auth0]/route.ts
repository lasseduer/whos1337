import {
  handleAuth,
  handleCallback,
  Session,
  Claims,
} from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import { generateName } from "@/app/utils";
import { getDbClient } from "../../utils";

const upsertUser = async (
  user: Claims
): Promise<{ nickname: string; points: number }> => {
  const dbClient = getDbClient();

  await dbClient.connect();
  try {
    const { rows } = await dbClient.query(`
      INSERT INTO users (
        userid,
        nickname
      ) VALUES (
        '${user.sub}',
        '${generateName()}'
      ) 
      ON CONFLICT (userid)
      DO UPDATE SET updated = NOW()
      RETURNING nickname, points;
    `);

    return { nickname: rows[0].nickname, points: rows[0].points };
  } finally {
    dbClient.end();
  }
};

const afterCallback = async (_: NextRequest, session: Session) => {
  if (session.user) {
    const { nickname, points } = await upsertUser(session.user);

    session.user.nickname = nickname;
    session.user.points = points;
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
