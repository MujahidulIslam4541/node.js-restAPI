import { pool } from "../../db";
import type { IUser } from "./users.interface";

const createUser = async (payload: IUser) => {
  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,age)VALUES($1,$2,$3,$4)RETURNING *
    `,
    [payload.name, payload.email, payload.password, payload.age],
  );
  return result.rows[0];
};

export const userService = {
  createUser,
};
