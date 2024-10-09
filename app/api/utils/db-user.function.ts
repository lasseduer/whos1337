import { Client } from "pg";
import { DbUserRead, DbUserWrite } from "../models";

export async function getUserById(
  dbClient: Client,
  userId: string
): Promise<DbUserRead | undefined> {
  const { rows } = await dbClient.query(`
    SELECT
      id,
      userid,
      nickname,
      points,
      created,
      updated
    FROM
      users
    WHERE
      userid = '${userId}'
  `);

  return rows.length === 0
    ? undefined
    : <DbUserRead>{
        id: rows[0].id,
        userid: rows[0].userid,
        nickname: rows[0].nickname,
        points: rows[0].points,
        created: rows[0].created,
        updated: rows[0].updated,
      };
}

export async function updateUser(
  dbClient: Client,
  user: DbUserWrite
): Promise<DbUserRead | undefined> {
  const { rows } = await dbClient.query(`
    UPDATE users
    SET
      nickname = '${user.nickname}'
    WHERE
      userid = '${user.userid}'
    RETURNING *;
  `);

  return rows.length === 0
    ? undefined
    : <DbUserRead>{
        id: rows[0].id,
        userid: rows[0].userid,
        nickname: rows[0].nickname,
        points: rows[0].points,
        created: rows[0].created,
        updated: rows[0].updated,
      };
}
