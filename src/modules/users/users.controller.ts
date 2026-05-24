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

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();
    res.status(200).json({
      message: "users receive successful",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
      error: error,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.getUser(id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      message: "user receive successful",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await userService.updateUser(id as string, req.body);

    if (!result) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      message: "user updated",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUser(id as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "user deleted success",
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
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
