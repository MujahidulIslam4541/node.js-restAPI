import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserDataIntoDB = async (payload: any) => {
  const { email, password } = payload;

  const userData = await pool.query("SELECT * FROM users WHERE email =$1", [
    email,
  ]);
  const user = userData.rows[0];
  if (!user) {
    throw new Error("User not found");
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid credentials");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
  };
  const accessToken = jwt.sign(jwtPayload, config.secret, {
    expiresIn: "1h",
  });
  return {accessToken};
};

export const authService = {
  loginUserDataIntoDB,
};
