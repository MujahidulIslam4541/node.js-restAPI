import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./users.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);

    res.status(201).json({
      message: "Data created  successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
};
