import db from "#db/client";

export async function createBoard(userId, name) {
  const sql = `
    INSERT INTO boards (user_id, name)
    VALUES ($1, $2)
    RETURNING *
  `;
  const { rows: [board] } = await db.query(sql, [userId, name]);
  return board;   

}

export async function getAllUserBoards(userId) {
  const sql = `
SELECT id, name, created_at
FROM boards
WHERE user_id = $1
ORDER BY created_at DESC
  `;
  const { rows: boards } = await db.query(sql, [userId]);
  return boards;
}

export async function updateBoard(boardId, userId, name) {
  const sql = `
    UPDATE boards
    SET name = $3
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const { rows: [board] } = await db.query(sql, [boardId, userId, name]);
  return board;
}

export async function deleteBoard(boardId, userId) {
  const sql = `
    DELETE FROM boards
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const { rows: [board] } = await db.query(sql, [boardId, userId]);
  return board;
}

export async function getBoardById(boardId, userId) {
  const sql = `
    SELECT id, name, created_at
    FROM boards
    WHERE id = $1 AND user_id = $2
  `;
  const { rows: [board] } = await db.query(sql, [boardId, userId]);
  return board;
}
