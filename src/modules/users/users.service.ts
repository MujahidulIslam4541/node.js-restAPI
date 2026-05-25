import { pool } from "../../db";
import type { IUser } from "./users.interface";
import bcrypt from "bcryptjs";

const createUser = async (payload: IUser) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,age)VALUES($1,$2,$3,$4)RETURNING *
    `,
    [payload.name, payload.email, hashedPassword, payload.age],
  );

  delete result.rows[0].password;

  return result.rows[0];
};

const getUsers = async () => {
  const result = await pool.query(
    `
      SELECT * FROM users
      `,
  );

  result.rows.forEach((row: any) => {
    delete row.password;
  });

  return result;
};

const getUser = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id=$1
      `,
    [id],
  );
  delete result.rows[0].password;
  return result;
};

const updateUser = async (id: string, payload: IUser) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const result = await pool.query(
    `
      UPDATE users SET 
      name=COALESCE($1 ,name),
      password=COALESCE($2 ,password),
      age=COALESCE($3 ,age)
      WHERE id=$4 RETURNING *

      `,
    [payload.name, hashedPassword, payload.age, id],
  );
  delete result.rows[0].password;
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
