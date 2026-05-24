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

const getUsers = async () => {
  const result = await pool.query(
    `
      SELECT * FROM users
      `,
  );
  return result;
};

const getUser = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id=$1
      `,
    [id],
  );
  return result;
};

const updateUser = async (id: string, payload: IUser) => {
  const result = await pool.query(
    `
      UPDATE users SET 
      name=COALESCE($1 ,name),
      password=COALESCE($2 ,password),
      age=COALESCE($3 ,age)
      WHERE id=$4 RETURNING *

      `,
    [payload.name, payload.password, payload.age, id],
  );
  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const result = await pool.query(
    `
      DELETE  FROM users WHERE  id=$1

      `,
    [id],
  );
  return result;
};

export const userService = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
