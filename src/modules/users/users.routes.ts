import { Router, type Request, type Response } from "express";
import { userController } from "./users.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.post("/", userController.createUser);
// get all users from db
router.get("/", authMiddleware, userController.getUsers);

// get single user from db
router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

export const userRouter = router;
