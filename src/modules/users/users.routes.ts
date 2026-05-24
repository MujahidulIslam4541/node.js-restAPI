import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./users.controller";

const router = Router();

router.post("/", userController.createUser);

export const userRouter = router;
