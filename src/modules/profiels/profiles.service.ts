import { pool } from "../../db";

const createProfile = async (data: any) => {
  const { user_id, number, bio, gender } = data;

  const result = await pool.query(
    `
    SELECT * FROM users WHERE id=$1
    `,
    [user_id],
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const profileResult = await pool.query(
    `
    INSERT INTO profiles (user_id, number, bio, gender) VALUES ($1, $2, $3, $4) RETURNING *
    `,
    [user_id, number, bio, gender],
  );

  return profileResult;
};

export const profileService = {
  createProfile,
};
