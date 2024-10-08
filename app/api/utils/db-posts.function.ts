import { getMillisecondsAfter1337, MILLISECONDS_IN_MINUTE } from "@/app/utils";
import { CreatePostQueryResult, DbPostRead, DbPostWrite } from "../models";
import { Client } from "pg";

export async function getLatestPostByUserId(
  dbClient: Client,
  userId: string
): Promise<DbPostRead | undefined> {
  const { rows } = await dbClient.query(`
      SELECT
        events.id,
        events.userid,
        events.message,
        TO_CHAR(events.timestamp AT TIME ZONE timezone, 'YYYY-MM-DD HH24:MI:SS.MSOF') AS timestamp,
        events.timezone
      FROM events
      LEFT JOIN users ON users.id = events.userid
      WHERE users.userid = '${userId}'
      ORDER BY timestamp DESC
      LIMIT 1;
    `);

  if (rows.length === 0) {
    return undefined;
  }

  return <DbPostRead>{
    id: rows[0].id,
    userId: rows[0].userid,
    message: rows[0].message,
    timestamp: rows[0].timestamp,
    timezone: rows[0].timezone,
  };
}

export async function createPost(
  dbClient: Client,
  post: DbPostWrite
): Promise<CreatePostQueryResult> {
  const result: CreatePostQueryResult = {
    points: null,
    pointsInTotal: null,
  };

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
        '${post.timezone}', 
        (
          SELECT id 
          FROM users 
          WHERE userid = '${post.userId}'
        )
      );
    `);
  const points =
    MILLISECONDS_IN_MINUTE -
    (getMillisecondsAfter1337(post.timestamp) ?? MILLISECONDS_IN_MINUTE);

  result.points = `${points}`;

  if (post.userId) {
    const { rows } = await dbClient.query(`
        UPDATE users
        SET points = points + ${points}
        WHERE userid = '${post.userId}'
        RETURNING points;
        `);

    result.pointsInTotal = `${rows[0].points}`;
  }

  await dbClient.query("COMMIT");

  return result;
}
