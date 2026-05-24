import { Router, type Request, type Response } from "express";
import { userController } from "./users.controller";

const router = Router();

router.post("/", userController.createUser);
// get all users from db
router.get("/", userController.getUsers);

// get single user from db
router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

export const userRouter = router;
